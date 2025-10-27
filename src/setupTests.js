// src/setupTests.js
import '@testing-library/jest-dom';

// Provide globals your component expects at runtime (pdfjsLib, html2canvas, jsPDF) and stub execCommand.

beforeEach(() => {
  // Mock pdf.js: getDocument(...).promise -> resolves with a 2-page PDF
  global.pdfjsLib = {
    getDocument: jest.fn(() => ({
      promise: Promise.resolve({
        numPages: 2,
        getPage: jest.fn(async () => ({
          getViewport: ({ scale }) => ({
            width: 100 * scale,
            height: 200 * scale,
          }),
          render: () => ({ promise: Promise.resolve() }),
        })),
      }),
    })),
  };

  // Mock html2canvas: resolves to a canvas with width/height
  global.html2canvas = jest.fn(async () => {
    const canvas = Object.assign(document.createElement('canvas'), {
      width: 800,
      height: 1200,
    });
    const ctx = canvas.getContext('2d');
    ctx && ctx.fillRect(0, 0, 1, 1);
    return canvas;
  });

  // Mock jsPDF: collect instances so tests can assert addImage/save calls
  const instances = [];
  const Ctor = jest.fn(() => {
    const inst = {
      addImage: jest.fn(),
      save: jest.fn(),
      internal: { pageSize: { getWidth: () => 595.28 } }, // A4 width in pt
    };
    instances.push(inst);
    return inst;
  });
  global.__jspdfInstances = instances;
  global.jspdf = { jsPDF: Ctor };

  // Stub deprecated execCommand so tests can assert invocations
  document.execCommand = jest.fn(() => true);
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});
