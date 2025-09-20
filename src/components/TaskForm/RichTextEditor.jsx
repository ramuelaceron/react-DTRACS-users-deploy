import React, { useRef, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import './TaskForm.css';

const RichTextEditor = ({ value, onChange }) => {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Enter task description with formatting...'
  });

  const hasSetContent = useRef(false);

  // Set initial value
  useEffect(() => {
    if (quill && !hasSetContent.current) {
      quill.clipboard.dangerouslyPasteHTML(value || '');
      hasSetContent.current = true;
    }
  }, [quill, value]);

  // Listen for changes
  useEffect(() => {
    if (quill) {
      const handler = () => {
        const html = quill.root.innerHTML;
        onChange(html);
      };
      quill.on('text-change', handler);
      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [quill, onChange]);

  return (
    <div className="rich-text-editor-container">
      <div ref={quillRef} className="rich-text-editor" />
    </div>
  );
};

export default RichTextEditor;