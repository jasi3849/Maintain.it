import { useState } from 'react'
import Editor from "@monaco-editor/react"

function Home() {
  const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .hero-image {
            width: 100%;
            max-width: 600px;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
        }
        .title {
            color: #2c3e50;
            font-size: 2.5em;
        }
        .description {
            color: #555;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Welcome to Our Website</h1>
        <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="Coding workspace with laptop"
            class="hero-image"
        />
        <p class="description">
            This is a sample page that demonstrates how you can structure your content
            with clean HTML and CSS. The image above is loaded from Unsplash and shows
            a modern workspace setup.
        </p>
    </div>
</body>
</html>`

  const [code, setCode] = useState(defaultCode)
  const [showPreview, setShowPreview] = useState(true)

  const handleEditorChange = (value) => {
    setCode(value)
    setShowPreview(true)
  }

  return (
    <div className="home-container">
      <style>
        {`
          .home-container {
            padding: 20px;
            background: #f8f9fa;
            min-height: calc(100vh - 100px);
          }

          .editor-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .editor-container {
            height: 600px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
          }

          .preview-window {
            background: white;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
          }

          .preview-window iframe {
            width: 100%;
            height: 600px;
            border: none;
          }

          .welcome-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            line-height: 1.6;
            margin-top: 30px;
          }

          .welcome-content h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 24px;
          }

          .welcome-content p {
            color: #555;
            margin-bottom: 15px;
            font-size: 16px;
          }

          @media (max-width: 1024px) {
            .editor-section {
              grid-template-columns: 1fr;
            }
            
            .editor-container,
            .preview-window iframe {
              height: 400px;
            }
          }
        `}
      </style>



          
      <div className="welcome-content">
        <h2>Welcome to Maintain.it</h2>
        <p>
          Freelancers often juggle multiple client websites, wasting hours on repetitive code changes just to swap an image or tweak a headline. One small update can mean tracking down code in multiple places, risking costly errors or downtime.
        </p>
        <p>
          Maintain.it solves these headaches by letting you manage images, text snippets, and color variables from a single dashboard. Your updates instantly reflect on every site that references them—no more scouring code or redeploying entire projects.
        </p>
        <p>
          Try our built-in code editor and live preview to see exactly how your changes look before they go live. It's a fast, reliable way to keep your clients' websites up-to-date without the usual hassle.
        </p>
      </div>

      <div className="editor-section">
        <div className="editor-container">
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              autoIndent: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
        <div className="preview-window">
          {showPreview && (
            <iframe
              srcDoc={code}
              title="preview"
              sandbox="allow-scripts"
            />
          )}
        </div>
      </div>

      
    </div>
  )
}

export default Home