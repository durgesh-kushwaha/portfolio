'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useCallback } from 'react';

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: 'blog-link' } }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your blog post...' }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog-images');

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Image upload failed');
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor">
      <div className="tiptap-toolbar">
        <div className="tiptap-toolbar-group">
          <select
            className="tiptap-select"
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' :
              editor.isActive('heading', { level: 4 }) ? '4' : '0'
            }
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
              }
            }}
          >
            <option value="0">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>
        </div>

        <div className="tiptap-toolbar-divider"></div>

        <div className="tiptap-toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`tiptap-btn ${editor.isActive('bold') ? 'active' : ''}`} title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`tiptap-btn ${editor.isActive('italic') ? 'active' : ''}`} title="Italic">
            <em>I</em>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`tiptap-btn ${editor.isActive('underline') ? 'active' : ''}`} title="Underline">
            <span style={{ textDecoration: 'underline' }}>U</span>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`tiptap-btn ${editor.isActive('strike') ? 'active' : ''}`} title="Strikethrough">
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={`tiptap-btn ${editor.isActive('highlight') ? 'active' : ''}`} title="Highlight">
            <span style={{ backgroundColor: '#fef08a', padding: '0 2px', borderRadius: 2 }}>H</span>
          </button>
        </div>

        <div className="tiptap-toolbar-divider"></div>

        <div className="tiptap-toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`tiptap-btn ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`} title="Align Left">
            ≡
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`tiptap-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`} title="Align Center">
            ≡
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`tiptap-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`} title="Align Right">
            ≡
          </button>
        </div>

        <div className="tiptap-toolbar-divider"></div>

        <div className="tiptap-toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`tiptap-btn ${editor.isActive('bulletList') ? 'active' : ''}`} title="Bullet List">
            •≡
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`tiptap-btn ${editor.isActive('orderedList') ? 'active' : ''}`} title="Numbered List">
            1.
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`tiptap-btn ${editor.isActive('blockquote') ? 'active' : ''}`} title="Quote">
            &ldquo;
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`tiptap-btn ${editor.isActive('codeBlock') ? 'active' : ''}`} title="Code Block">
            {'</>'}
          </button>
        </div>

        <div className="tiptap-toolbar-divider"></div>

        <div className="tiptap-toolbar-group">
          <button type="button" onClick={setLink} className={`tiptap-btn ${editor.isActive('link') ? 'active' : ''}`} title="Link">
            🔗
          </button>
          <button type="button" onClick={addImage} className="tiptap-btn" title="Insert Image">
            🖼️
          </button>
        </div>

        <div className="tiptap-toolbar-divider"></div>

        <div className="tiptap-toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="tiptap-btn" title="Horizontal Rule">
            —
          </button>
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className="tiptap-btn" title="Undo">
            ↩
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className="tiptap-btn" title="Redo">
            ↪
          </button>
        </div>

        <div className="tiptap-toolbar-group" style={{ marginLeft: 'auto' }}>
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            title="Text Color"
            className="tiptap-color-picker"
          />
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
