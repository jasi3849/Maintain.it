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
import { SketchPicker } from 'react-color'; // or any other color picker library
import {
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

function ColorManagement() {
  const [colors, setColors] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  // Form data has "title" (color name) and "hexCode"
  const [formData, setFormData] = useState({
    title: '',
    hexCode: '#ffffff'
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // For code editor
  const [selectedTab, setSelectedTab] = useState(0);
  const [exampleCode, setExampleCode] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Map tab index -> language
  const getLanguageFromTab = (tabIndex) => {
    const languages = ['html', 'javascript', 'python', 'php'];
    return languages[tabIndex];
  };

  // Code examples referencing "COLOR_ID"
  const codeExamples = {
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Replace COLOR_ID with your color ID */
    body {
      background-color: url("http://localhost:5000/api/colors/COLOR_ID");
    }
  </style>
</head>
<body>
  <h1>Dynamic Background Color</h1>
</body>
</html>`,
    javascript: `fetch('http://localhost:5000/api/colors/COLOR_ID')
  .then(res => res.json())
  .then(data => {
    // data.hexCode is the color
    document.body.style.backgroundColor = data.hexCode;
  });`,
    python: `import requests

# Replace COLOR_ID with your color ID
r = requests.get('http://localhost:5000/api/colors/COLOR_ID')
color_data = r.json()
print("Hex code:", color_data['hexCode'])`,
    php: `<?php
// Replace COLOR_ID with your color ID
$json = file_get_contents('http://localhost:5000/api/colors/COLOR_ID');
$data = json_decode($json, true);
echo "The color is: " . $data['hexCode'];
?>`
  };

  // On mount, fetch colors and init code editor
  useEffect(() => {
    fetchColors();
    // Default to HTML example
    setExampleCode(codeExamples.html);
  }, []);

  const fetchColors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/colors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setColors(response.data);
    } catch (error) {
      showAlert('Error fetching colors', 'error');
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Create new color
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.hexCode) {
      showAlert('Please fill all fields', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/colors/create', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showAlert('Color created successfully');
      setOpenCreateModal(false);
      setFormData({ title: '', hexCode: '#ffffff' });
      fetchColors();
    } catch (error) {
      showAlert('Error creating color', 'error');
    }
  };

  // Update color
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedColor) return;

    try {
      await axios.put(
        `http://localhost:5000/api/colors/${selectedColor._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      showAlert('Color updated successfully');
      setOpenUpdateModal(false);
      setSelectedColor(null);
      setFormData({ title: '', hexCode: '#ffffff' });
      fetchColors();
    } catch (error) {
      showAlert('Error updating color', 'error');
    }
  };

  const handleOpenUpdateModal = (colorObj) => {
    setSelectedColor(colorObj);
    setFormData({
      title: colorObj.title,
      hexCode: colorObj.hexCode
    });
    setOpenUpdateModal(true);
  };

  // Tab change for code examples
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Replace "COLOR_ID" with the selected color ID in the new code
    const codeArray = Object.values(codeExamples);
    const newCode = codeArray[newValue].replace(
      /COLOR_ID/g,
      selectedColorId || 'COLOR_ID'
    );
    setExampleCode(newCode);
  };

  // Editor content change
  const handleEditorChange = (value) => {
    setExampleCode(value);
  };

  // Select color ID from dropdown
  const handleColorIdChange = (event) => {
    const newId = event.target.value;
    setSelectedColorId(newId);
    // Replace all "COLOR_ID" with newId in the current editor code
    setExampleCode(exampleCode.replace(/COLOR_ID/g, newId));
  };

  // "Run Example" -> fetch color from platform URL, show preview
  const executeCode = async () => {
    if (!selectedColorId) {
      showAlert('Please select a color first', 'error');
      return;
    }
    setIsPreviewLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/colors/${selectedColorId}`);
      setPreviewContent(`Hex code: ${response.data.hexCode}`);
    } catch (error) {
      setPreviewContent('Error fetching color');
      showAlert('Error executing code', 'error');
    }
    setIsPreviewLoading(false);
  };

  // Copy URL to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => showAlert('URL copied to clipboard!'))
      .catch(() => showAlert('Failed to copy', 'error'));
  };

  // MUI modal style
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

  return (
    <div className="color-management">
      <style>
        {`
          .color-management {
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
          .color-preview-box {
            width: 30px;
            height: 20px;
            display: inline-block;
            margin-right: 8px;
            border: 1px solid #ccc;
          }
        `}
      </style>

      {/* Header */}
      <div className="header">
        <Typography variant="h5">Color Management</Typography>
        <Button
          variant="contained"
          className="create-button"
          onClick={() => setOpenCreateModal(true)}
        >
          Create New Color
        </Button>
      </div>

      {/* Table of colors */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Color Name</TableCell>
              <TableCell>Hex Code</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Platform URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.map((col) => (
              <TableRow key={col._id}>
                <TableCell>{col.title}</TableCell>
                <TableCell>{col.hexCode}</TableCell>
                <TableCell>
                  <div
                    className="color-preview-box"
                    style={{ backgroundColor: col.hexCode }}
                  />
                </TableCell>
                <TableCell>
                  <div className="platform-url">
                    {`http://localhost:5000/api/colors/${col._id}`}
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(`http://localhost:5000/api/colors/${col._id}`)}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenUpdateModal(col)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Code Examples section */}
      <div className="examples-section">
        <Typography variant="h6" gutterBottom>
          Usage Examples
        </Typography>
        <div className="editor-controls">
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="HTML" />
            <Tab label="JS" />
            <Tab label="Python" />
            <Tab label="PHP" />
          </Tabs>
          <FormControl className="text-select">
            <InputLabel>Select Color</InputLabel>
            <Select
              value={selectedColorId}
              onChange={handleColorIdChange}
              label="Select Color"
            >
              {colors.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={executeCode}
            className="execute-button"
            disabled={!selectedColorId || isPreviewLoading}
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
                Select a color and click "Run Example" to see the preview
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
          <Typography variant="h6" gutterBottom>
            Create New Color
          </Typography>
          <form onSubmit={handleCreate}>
            <TextField
              name="title"
              label="Color Name"
              fullWidth
              className="form-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Typography variant="body2" gutterBottom>Pick a Color:</Typography>
            <SketchPicker
              color={formData.hexCode}
              onChangeComplete={(color) =>
                setFormData({ ...formData, hexCode: color.hex })
              }
            />
            <div className="modal-buttons">
              <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
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
          <Typography variant="h6" gutterBottom>
            Update Color
          </Typography>
          {selectedColor && (
            <form onSubmit={handleUpdate}>
              <TextField
                name="title"
                label="Color Name"
                fullWidth
                className="form-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Typography variant="body2" gutterBottom>Pick a Color:</Typography>
              <SketchPicker
                color={formData.hexCode}
                onChangeComplete={(color) =>
                  setFormData({ ...formData, hexCode: color.hex })
                }
              />
              <div className="modal-buttons">
                <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </div>
            </form>
          )}
        </Box>
      </Modal>

      {/* Snackbar for alerts */}
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

export default ColorManagement;
