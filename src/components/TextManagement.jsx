// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Button,
//   Modal,
//   Box,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   ContentCopy as ContentCopyIcon
// } from '@mui/icons-material';
// import Editor from "@monaco-editor/react";

// function TextManagement() {
//   const [texts, setTexts] = useState([]);
//   const [openCreateModal, setOpenCreateModal] = useState(false);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);
//   const [selectedText, setSelectedText] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: ''
//   });
//   const [alert, setAlert] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [exampleCode, setExampleCode] = useState('');

//   const codeExamples = {
//     html: `<!DOCTYPE html>
// <html>
// <body>
//   <!-- Replace TEXT_ID with your text ID -->
//   <div id="dynamic-text"></div>
  
//   <script>
//     fetch('http://localhost:5000/api/texts/TEXT_ID')
//       .then(response => response.json())
//       .then(data => {
//         document.getElementById('dynamic-text').textContent = data.content;
//       });
//   </script>
// </body>
// </html>`,
//     react: `import { useState, useEffect } from 'react';

// function DynamicText() {
//   const [text, setText] = useState('');
  
//   useEffect(() => {
//     // Replace TEXT_ID with your text ID
//     fetch('http://localhost:5000/api/texts/TEXT_ID')
//       .then(response => response.json())
//       .then(data => setText(data.content));
//   }, []);

//   return <div>{text}</div>;
// }`,
//     python: `import requests

// # Replace TEXT_ID with your text ID
// response = requests.get('http://localhost:5000/api/texts/TEXT_ID')
// text_content = response.json()['content']
// print(text_content)`,
//     php: `<?php
// // Replace TEXT_ID with your text ID
// $response = file_get_contents('http://localhost:5000/api/texts/TEXT_ID');
// $data = json_decode($response, true);
// echo $data['content'];
// ?>`
//   };

//   useEffect(() => {
//     fetchTexts();
//     setExampleCode(codeExamples.html);
//   }, []);

//   const fetchTexts = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/texts', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setTexts(response.data);
//     } catch (error) {
//       showAlert('Error fetching texts', 'error');
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const showAlert = (message, severity = 'success') => {
//     setAlert({
//       open: true,
//       message,
//       severity
//     });
//   };

//   const handleCreate = async (event) => {
//     event.preventDefault();
    
//     if (!formData.title || !formData.content) {
//       showAlert('Please fill all fields', 'error');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:5000/api/texts/create', formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       showAlert('Text created successfully');
//       setOpenCreateModal(false);
//       setFormData({ title: '', content: '' });
//       fetchTexts();
//     } catch (error) {
//       showAlert('Error creating text', 'error');
//     }
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();
    
//     if (!selectedText) return;

//     try {
//       await axios.put(
//         `http://localhost:5000/api/texts/${selectedText._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       showAlert('Text updated successfully');
//       setOpenUpdateModal(false);
//       setSelectedText(null);
//       setFormData({ title: '', content: '' });
//       fetchTexts();
//     } catch (error) {
//       showAlert('Error updating text', 'error');
//     }
//   };

//   const handleOpenUpdateModal = (text) => {
//     setSelectedText(text);
//     setFormData({
//       title: text.title,
//       content: text.content
//     });
//     setOpenUpdateModal(true);
//   };

//   const handleCopyUrl = (url) => {
//     navigator.clipboard.writeText(url);
//     showAlert('URL copied to clipboard');
//   };

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//     setExampleCode(Object.values(codeExamples)[newValue]);
//   };

//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2
//   };

//   return (
//     <div className="text-management">
//       <style>
//         {`
//           .text-management {
//             padding: 20px;
//           }

//           .header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-bottom: 20px;
//           }

//           .create-button {
//             background-color: #2c3e50 !important;
//             color: white !important;
//           }

//           .table-container {
//             margin-top: 20px;
//             box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
//           }

//           .form-field {
//             margin-bottom: 20px !important;
//           }

//           .platform-url {
//             max-width: 200px;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .modal-buttons {
//             display: flex;
//             justify-content: flex-end;
//             gap: 10px;
//             margin-top: 20px;
//           }

//           .examples-section {
//             margin-top: 40px;
//           }

//           .editor-preview {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 20px;
//             margin-top: 20px;
//             background: white;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           }

//           .preview-window {
//             padding: 20px;
//             background: #f5f5f5;
//             border-radius: 4px;
//             min-height: 300px;
//           }
//         `}
//       </style>

//       <div className="header">
//         <Typography variant="h5" component="h2">Text Management</Typography>
//         <Button
//           variant="contained"
//           className="create-button"
//           onClick={() => setOpenCreateModal(true)}
//         >
//           Create New Text
//         </Button>
//       </div>

//       <TableContainer component={Paper} className="table-container">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Title</TableCell>
//               <TableCell>Content</TableCell>
//               <TableCell>Platform URL</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {texts.map((text) => (
//               <TableRow key={text._id}>
//                 <TableCell>{text.title}</TableCell>
//                 <TableCell>{text.content}</TableCell>
//                 <TableCell>
//                   <div className="platform-url">
//                     {`http://localhost:5000/api/texts/${text._id}`}
//                     <IconButton
//                       size="small"
//                       onClick={() => handleCopyUrl(`http://localhost:5000/api/texts/${text._id}`)}
//                     >
//                       <ContentCopyIcon fontSize="small" />
//                     </IconButton>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <IconButton
//                     color="primary"
//                     onClick={() => handleOpenUpdateModal(text)}
//                   >
//                     <EditIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <div className="examples-section">
//         <Typography variant="h6" gutterBottom>
//           Usage Examples
//         </Typography>
//         <Tabs value={selectedTab} onChange={handleTabChange}>
//           <Tab label="HTML" />
//           <Tab label="React" />
//           <Tab label="Python" />
//           <Tab label="PHP" />
//         </Tabs>
//         <div className="editor-preview">
//           <Editor
//             height="300px"
//             defaultLanguage="javascript"
//             theme="vs-dark"
//             value={exampleCode}
//             options={{
//               readOnly: true,
//               minimap: { enabled: false },
//               fontSize: 14,
//               wordWrap: 'on'
//             }}
//           />
//           <div className="preview-window">
//             <Typography variant="body2" color="textSecondary">
//               Preview will show here when you select a text and update the example code.
//             </Typography>
//           </div>
//         </div>
//       </div>

//       {/* Create Modal */}
//       <Modal
//         open={openCreateModal}
//         onClose={() => setOpenCreateModal(false)}
//       >
//         <Box sx={modalStyle}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Create New Text
//           </Typography>
//           <form onSubmit={handleCreate}>
//             <TextField
//               name="title"
//               label="Title"
//               fullWidth
//               className="form-field"
//               value={formData.title}
//               onChange={handleInputChange}
//             />
//             <TextField
//               name="content"
//               label="Content"
//               fullWidth
//               multiline
//               rows={4}
//               className="form-field"
//               value={formData.content}
//               onChange={handleInputChange}
//             />
//             <div className="modal-buttons">
//               <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//               >
//                 Create
//               </Button>
//             </div>
//           </form>
//         </Box>
//       </Modal>

//       {/* Update Modal */}
//       <Modal
//         open={openUpdateModal}
//         onClose={() => setOpenUpdateModal(false)}
//       >
//         <Box sx={modalStyle}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Update Text
//           </Typography>
//           {selectedText && (
//             <form onSubmit={handleUpdate}>
//               <TextField
//                 name="title"
//                 label="Title"
//                 fullWidth
//                 className="form-field"
//                 value={formData.title}
//                 onChange={handleInputChange}
//               />
//               <TextField
//                 name="content"
//                 label="Content"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 className="form-field"
//                 value={formData.content}
//                 onChange={handleInputChange}
//               />
//               <div className="modal-buttons">
//                 <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                 >
//                   Update
//                 </Button>
//               </div>
//             </form>
//           )}
//         </Box>
//       </Modal>

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={() => setAlert({ ...alert, open: false })}
//       >
//         <Alert
//           onClose={() => setAlert({ ...alert, open: false })}
//           severity={alert.severity}
//           sx={{ width: '100%' }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// export default TextManagement;




import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Edit as EditIcon,
  
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import Editor from "@monaco-editor/react";

function TextManagement() {
  const [texts, setTexts] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [exampleCode, setExampleCode] = useState('');
  const [selectedTextId, setSelectedTextId] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const getLanguageFromTab = (tabIndex) => {
    const languages = ['html', 'javascript', 'python', 'php'];
    return languages[tabIndex];
  };

  const codeExamples = {
    html: `<!DOCTYPE html>
<html>
<body>
  <!-- Replace TEXT_ID with your text ID -->
  <div id="dynamic-text"></div>
  
  <script>
    fetch('http://localhost:5000/api/texts/TEXT_ID')
      .then(response => response.json())
      .then(data => {
        document.getElementById('dynamic-text').textContent = data.content;
      });
  </script>
</body>
</html>`,
    react: `import { useState, useEffect } from 'react';

function DynamicText() {
  const [text, setText] = useState('');
  
  useEffect(() => {
    // Replace TEXT_ID with your text ID
    fetch('http://localhost:5000/api/texts/TEXT_ID')
      .then(response => response.json())
      .then(data => setText(data.content));
  }, []);

  return <div>{text}</div>;
}`,
    python: `import requests

# Replace TEXT_ID with your text ID
response = requests.get('http://localhost:5000/api/texts/TEXT_ID')
text_content = response.json()['content']
print(text_content)`,
    php: `<?php
// Replace TEXT_ID with your text ID
$response = file_get_contents('http://localhost:5000/api/texts/TEXT_ID');
$data = json_decode($response, true);
echo $data['content'];
?>`
  };

  useEffect(() => {
    fetchTexts();
    setExampleCode(codeExamples.html);
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/texts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTexts(response.data);
    } catch (error) {
      showAlert('Error fetching texts', 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    
    if (!formData.title || !formData.content) {
      showAlert('Please fill all fields', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/texts/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      showAlert('Text created successfully');
      setOpenCreateModal(false);
      setFormData({ title: '', content: '' });
      fetchTexts();
    } catch (error) {
      showAlert('Error creating text', 'error');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    
    if (!selectedText) return;

    try {
      await axios.put(
        `http://localhost:5000/api/texts/${selectedText._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      showAlert('Text updated successfully');
      setOpenUpdateModal(false);
      setSelectedText(null);
      setFormData({ title: '', content: '' });
      fetchTexts();
    } catch (error) {
      showAlert('Error updating text', 'error');
    }
  };

  const handleOpenUpdateModal = (text) => {
    setSelectedText(text);
    setFormData({
      title: text.title,
      content: text.content
    });
    setOpenUpdateModal(true);
  };


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    const newCode = Object.values(codeExamples)[newValue].replace('TEXT_ID', selectedTextId || 'TEXT_ID');
    setExampleCode(newCode);
  };

  const handleEditorChange = (value) => {
    setExampleCode(value);
  };

  const handleTextIdChange = (event) => {
    const newTextId = event.target.value;
    setSelectedTextId(newTextId);
    setExampleCode(exampleCode.replace(/TEXT_ID/g, newTextId));
  };

  const executeCode = async () => {
    if (!selectedTextId) {
      showAlert('Please select a text ID first', 'error');
      return;
    }

    setIsPreviewLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/texts/${selectedTextId}`);
      setPreviewContent(response.data.content);
    } catch (error) {
      setPreviewContent('Error fetching text content');
      showAlert('Error executing code', 'error');
    }
    setIsPreviewLoading(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        showAlert('URL copied to clipboard!');
      })
      .catch(() => {
        showAlert('Failed to copy', 'error');
      });
  };

  
  return (
    <div className="text-management">
      <style>
        {`
          .text-management {
            padding: 20px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .create-button {
            background-color: #2c3e50 !important;
            color: white !important;
          }

          .table-container {
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
          }

          .form-field {
            margin-bottom: 20px !important;
          }

          .platform-url {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
          }

          .examples-section {
            margin-top: 40px;
          }

          .editor-controls {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 20px 0;
          }

          .editor-preview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .preview-window {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            min-height: 300px;
            overflow-wrap: break-word;
          }

          .execute-button {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .text-select {
            min-width: 200px;
          }
        `}
      </style>

      <div className="header">
        <Typography variant="h5" component="h2">Text Management</Typography>
        <Button
          variant="contained"
          className="create-button"
          onClick={() => setOpenCreateModal(true)}
        >
          Create New Text
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Platform URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {texts.map((text) => (
              <TableRow key={text._id}>
                <TableCell>{text.title}</TableCell>
                <TableCell>{text.content}</TableCell>
                <TableCell>
                  <div className="platform-url">
                    {`http://localhost:5000/api/texts/${text._id}`}
                   
                  </div>
                    {/* Copy-to-clipboard button */}
                    <IconButton
                     onClick={() => copyToClipboard(`http://localhost:5000/api/texts/${text._id}`)}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                     <ContentCopyIcon fontSize="inherit" />
                     </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenUpdateModal(text)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="examples-section">
        <Typography variant="h6" gutterBottom>
          Usage Examples
        </Typography>
        <div className="editor-controls">
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="HTML" />
            <Tab label="React" />
            <Tab label="Python" />
            <Tab label="PHP" />
          </Tabs>
          <FormControl className="text-select">
            <InputLabel>Select Text</InputLabel>
            <Select
              value={selectedTextId}
              onChange={handleTextIdChange}
              label="Select Text"
            >
              {texts.map((text) => (
                <MenuItem key={text._id} value={text._id}>
                  {text.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={executeCode}
            className="execute-button"
            disabled={!selectedTextId || isPreviewLoading}
          >
            <PlayArrowIcon /> Run Example
          </Button>
        </div>
        <div className="editor-preview">
          <Editor
            height="300px"
            language={getLanguageFromTab(selectedTab)}
            theme="vs-dark"
            value={exampleCode}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on'
            }}
          />
          <div className="preview-window">
            {isPreviewLoading ? (
              <Typography>Loading preview...</Typography>
            ) : previewContent ? (
              <Typography>{previewContent}</Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Select a text and click "Run Example" to see the preview
              </Typography>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create New Text
          </Typography>
          <form onSubmit={handleCreate}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              className="form-field"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              className="form-field"
              value={formData.content}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Update Modal */}
      <Modal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Update Text
          </Typography>
          {selectedText && (
            <form onSubmit={handleUpdate}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                className="form-field"
                value={formData.title}
                onChange={handleInputChange}
              />
              <TextField
                name="content"
                label="Content"
                fullWidth
                multiline
                rows={4}
                className="form-field"
                value={formData.content}
                onChange={handleInputChange}
              />
              <div className="modal-buttons">
                <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>
              </div>
            </form>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TextManagement;