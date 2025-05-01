import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './EditorPage.css';

const EditorPage = () => {
  useEffect(() => {
    // Get reference to the editable content area
    const editor = document.querySelector('.resume-content');
    
    // Fix for formatting buttons (bold, italic, underline, etc.)
    document.querySelectorAll('.icon-button').forEach(button => {
      button.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Prevent default to maintain selection
        
        const cmd = this.getAttribute('data-cmd');
        if (cmd) {
          // Make sure the editor has focus before executing command
          if (!document.activeElement || document.activeElement !== editor) {
            editor.focus();
          }
          
          // Execute the formatting command
          document.execCommand(cmd, false, null);
          
          // Prevent any other default behavior that might cause losing selection
          return false;
        }
      });
    });

    // Additional workaround to ensure editor always gets focus when clicked
    editor.addEventListener('mousedown', function() {
      if (!document.activeElement || document.activeElement !== editor) {
        setTimeout(() => {
          editor.focus();
        }, 0);
      }
    });

    // Format select change event mapping: Paragraph, Heading 1-3
    const formatSelect = document.getElementById('formatSelect');
    if (formatSelect) {
      formatSelect.addEventListener('change', function () {
        // Focus the editor
        editor.focus();
        
        // Apply the format
        const tag = this.value; // expecting p, h1, h2, h3
        document.execCommand('formatBlock', false, tag);
      });
    }

    // Upload button event - trigger file input click
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', function () {
        const pdfUpload = document.getElementById('pdfUpload');
        if (pdfUpload) {
          pdfUpload.click();
        }
      });
    }

    // PDF file reading and rendering using PDF.js
    const pdfUpload = document.getElementById('pdfUpload');
    if (pdfUpload) {
      pdfUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
          const fileReader = new FileReader();
          fileReader.onload = function () {
            const typedarray = new Uint8Array(this.result);
            window.pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
              const resumeContent = document.querySelector('.resume-content');
              // Clear the current content to render the PDF pages
              resumeContent.innerHTML = "";
              // Loop through every page
              for (let i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then(function (page) {
                  const viewport = page.getViewport({ scale: 1.5 });
                  const canvas = document.createElement("canvas");
                  canvas.classList.add("pdf-page-canvas");
                  canvas.style.display = "block";
                  canvas.style.margin = "1rem auto";
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  const context = canvas.getContext('2d');
                  const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                  };
                  // Render the page on the canvas
                  page.render(renderContext).promise.then(function () {
                    resumeContent.appendChild(canvas);
                  });
                });
              }
            }).catch(err => {
              alert('Error loading PDF: ' + err.message);
            });
          };
          fileReader.readAsArrayBuffer(file);
        } else {
          alert('Please upload a valid PDF file.');
        }
      });
    }

    // Download button event: using html2canvas to snapshot the resume and jsPDF to create a PDF
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        const targetElement = document.querySelector('.resume-paper');
        window.html2canvas(targetElement).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'pt', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          // Calculate the height of the image to maintain aspect ratio
          const imgWidth = pdfWidth;
          const imgHeight = canvas.height * pdfWidth / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('resume.pdf');
        }).catch(err => {
          alert('Error generating PDF: ' + err.message);
        });
      });
    }

    // Optional: Save and Auto-optimize buttons (dummy events for now)
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        alert('Resume saved (this is a dummy implementation).');
      });
    }
    const autoOptimizeBtn = document.getElementById('autoOptimizeBtn');
    if (autoOptimizeBtn) {
      autoOptimizeBtn.addEventListener('click', function () {
        alert('Auto-Optimize not implemented.');
      });
    }
    const optimizeBtn = document.getElementById('optimizeBtn');
    if (optimizeBtn) {
      optimizeBtn.addEventListener('click', function () {
        alert('Optimize Resume not implemented.');
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Resume Editor | ResumeAI</title>
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* PDF.js */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
        {/* jsPDF */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        {/* html2canvas */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      </Helmet>

      <header>
        <div className="container">
          <nav>
            <a href="index.html" className="logo">
              <i className="fa-solid fa-file-circle-check logo-icon"></i>
              ResumeAI
            </a>
            <ul className="nav-links">
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Help</a></li>
            </ul>
            <div className="nav-buttons">
              <button className="button button-secondary" id="saveBtn">Save</button>
              <button className="button" id="downloadBtn">Download</button>
            </div>
          </nav>
        </div>
      </header>

      <div className="editor-container">
        <div className="sidebar">
          <div className="ats-score-container">
            <h3 className="score-title">ATS Compatibility Score</h3>
            <div className="score-circle">
              <div className="score-inner-circle">
                <div className="score-value">75%</div>
                <div className="score-label">Good</div>
              </div>
            </div>
            <div className="score-message">Your resume is performing well but has room for improvement</div>
            <button className="button" id="optimizeBtn">Optimize Resume</button>
          </div>

          <div className="section-analytics">
            <h3 className="section-title">Section Analysis</h3>
            <div className="section-item">
              <div className="section-header">
                <span className="section-name">Contact Information</span>
                <span className="section-score">100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="section-item">
              <div className="section-header">
                <span className="section-name">Professional Summary</span>
                <span className="section-score">85%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="section-item">
              <div className="section-header">
                <span className="section-name">Work Experience</span>
                <span className="section-score warning">65%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: "65%", backgroundColor: "var(--warning)" }}></div>
              </div>
            </div>
            <div className="section-item">
              <div className="section-header">
                <span className="section-name">Education</span>
                <span className="section-score">80%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div className="section-item">
              <div className="section-header">
                <span className="section-name">Skills</span>
                <span className="section-score danger">50%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: "50%", backgroundColor: "var(--danger)" }}></div>
              </div>
            </div>
          </div>

          <div className="keyword-analytics">
            <h3 className="section-title">Keyword Analysis</h3>
            <div className="keyword-list">
              <div className="keyword-badge">
                <i className="fa-solid fa-check"></i> project management
              </div>
              <div className="keyword-badge">
                <i className="fa-solid fa-check"></i> agile
              </div>
              <div className="keyword-badge">
                <i className="fa-solid fa-check"></i> leadership
              </div>
              <div className="keyword-badge missing-keyword">
                <i className="fa-solid fa-xmark"></i> scrum
              </div>
              <div className="keyword-badge missing-keyword">
                <i className="fa-solid fa-xmark"></i> kanban
              </div>
              <div className="keyword-badge">
                <i className="fa-solid fa-check"></i> communication
              </div>
              <div className="keyword-badge missing-keyword">
                <i className="fa-solid fa-xmark"></i> stakeholder
              </div>
              <div className="keyword-badge">
                <i className="fa-solid fa-check"></i> analysis
              </div>
            </div>
          </div>

          <div className="suggestions">
            <h3 className="section-title">Improvement Suggestions</h3>
            <div className="suggestion-item">
              <div className="suggestion-title">
                <i className="fa-solid fa-lightbulb"></i>
                Add missing keywords
              </div>
              <p className="suggestion-text">Include keywords like "scrum," "kanban," and "stakeholder management" in your Skills or Work Experience section.</p>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-title">
                <i className="fa-solid fa-lightbulb"></i>
                Quantify achievements
              </div>
              <p className="suggestion-text">Add specific metrics and numbers to your work experience to demonstrate the impact of your contributions.</p>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-title">
                <i className="fa-solid fa-lightbulb"></i>
                Format optimization
              </div>
              <p className="suggestion-text">Use a clean, ATS-friendly format with standard section headings for better parsing.</p>
            </div>
          </div>
        </div>

        <div className="editor-main">
          <div className="editor-toolbar">
            <div className="toolbar-section">
              <div className="select-wrapper">
                <select className="select-format" id="formatSelect">
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
                <i className="fa-solid fa-chevron-down select-icon"></i>
              </div>
              <div className="toolbar-divider"></div>
              <button className="icon-button" data-cmd="bold">
                <i className="fa-solid fa-bold"></i>
              </button>
              <button className="icon-button" data-cmd="italic">
                <i className="fa-solid fa-italic"></i>
              </button>
              <button className="icon-button" data-cmd="underline">
                <i className="fa-solid fa-underline"></i>
              </button>
            </div>

            <div className="toolbar-section">
              <button className="icon-button" data-cmd="insertUnorderedList">
                <i className="fa-solid fa-list-ul"></i>
              </button>
              <button className="icon-button" data-cmd="insertOrderedList">
                <i className="fa-solid fa-list-ol"></i>
              </button>
            </div>

            <div className="toolbar-section">
              <button className="icon-button" data-cmd="justifyLeft">
                <i className="fa-solid fa-align-left"></i>
              </button>
              <button className="icon-button" data-cmd="justifyCenter">
                <i className="fa-solid fa-align-center"></i>
              </button>
              <button className="icon-button" data-cmd="justifyRight">
                <i className="fa-solid fa-align-right"></i>
              </button>
            </div>

            <div className="toolbar-actions">
              <button className="button button-secondary" id="uploadBtn">
                <i className="fa-solid fa-upload"></i> Upload New
              </button>
              <button className="button" id="autoOptimizeBtn">
                <i className="fa-solid fa-magic"></i> Auto-Optimize
              </button>
            </div>
          </div>

          <div className="resume-container">
            <div className="resume-paper">
              <div className="resume-content" contentEditable="true" spellCheck="false">
                {/* Simplified resume structure for better editability */}
                <div className="resume-header">
                  <div className="resume-name">NAME</div>
                  <div className="resume-contact">
                    <div className="resume-contact-item">
                      <i className="fa-solid fa-envelope"></i> abc@email.com
                    </div>
                    <div className="resume-contact-item">
                      <i className="fa-solid fa-phone"></i> 999-9999-999
                    </div>
                    <div className="resume-contact-item">
                      <i className="fa-solid fa-location-dot"></i> location
                    </div>
                    <div className="resume-contact-item">
                      <i className="fa-brands fa-linkedin"></i> linkedin.com/in/abc
                    </div>
                  </div>
                </div>

                <div className="resume-section">
                  <div className="resume-section-title">Professional Summary</div>
                  <p>
                    Dedicated Project Manager with over 8 years of experience in leading cross-functional teams to deliver complex software projects. Skilled in agile methodologies, risk management, and fostering collaborative team environments. Proven track record of completing projects on time and within budget while maintaining high quality standards. Looking to leverage my stakeholder management expertise in a challenging role at a forward-thinking company.
                  </p>
                </div>

                <div className="resume-section">
                  <div className="resume-section-title">Work Experience</div>
                  <div className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">Senior Project Manager</div>
                        <div className="resume-item-subtitle">TechNova Solutions</div>
                      </div>
                      <div className="resume-item-period">Jan 2020 - Present</div>
                    </div>
                    <div className="resume-item-description">
                      <div className="resume-item-bullet">• Led a team of 15 developers, designers, and QA specialists in delivering enterprise SaaS products</div>
                      <div className="resume-item-bullet">• Implemented agile frameworks resulting in 30% faster time-to-market</div>
                      <div className="resume-item-bullet">• Managed project budgets exceeding $2M with consistently on-target financial performance</div>
                      <div className="resume-item-bullet">• Facilitated daily stand-ups and sprint planning sessions to maintain team alignment and productivity</div>
                    </div>
                  </div>

                  <div className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">Project Manager</div>
                        <div className="resume-item-subtitle">InnovateTech Inc.</div>
                      </div>
                      <div className="resume-item-period">Mar 2017 - Dec 2019</div>
                    </div>
                    <div className="resume-item-description">
                      <div className="resume-item-bullet">• Oversaw the development and launch of 5 successful mobile applications</div>
                      <div className="resume-item-bullet">• Introduced scrum and kanban methodologies, increasing team efficiency by 25%</div>
                      <div className="resume-item-bullet">• Developed comprehensive project plans, timelines, and resource allocations</div>
                      <div className="resume-item-bullet">• Conducted regular risk assessments and implemented mitigation strategies</div>
                    </div>
                  </div>
                </div>

                <div className="resume-section">
                  <div className="resume-section-title">Education</div>
                  <div className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">Master of Business Administration (MBA)</div>
                        <div className="resume-item-subtitle">Columbia University</div>
                      </div>
                      <div className="resume-item-period">2015 - 2017</div>
                    </div>
                  </div>

                  <div className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">Bachelor of Science in Computer Science</div>
                        <div className="resume-item-subtitle">New York University</div>
                      </div>
                      <div className="resume-item-period">2011 - 2015</div>
                    </div>
                  </div>
                </div>

                <div className="resume-section">
                  <div className="resume-section-title">Certifications</div>
                  <div className="resume-item">
                    <div className="resume-item-description">
                      <div className="resume-item-bullet">• Project Management Professional (PMP)</div>
                      <div className="resume-item-bullet">• Certified ScrumMaster (CSM)</div>
                      <div className="resume-item-bullet">• ITIL Foundation</div>
                    </div>
                  </div>
                </div>

                <div className="resume-section">
                  <div className="resume-section-title">Skills</div>
                  <div className="resume-skill-list">
                    <div className="resume-skill">Team Leadership</div>
                    <div className="resume-skill">Agile Methodologies</div>
                    <div className="resume-skill">Project Management</div>
                    <div className="resume-skill">Risk Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for PDF upload */}
      <input type="file" id="pdfUpload" accept="application/pdf" style={{ display: "none" }} />
    </>
  );
};

export default EditorPage;