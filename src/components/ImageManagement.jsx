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
import { Edit as EditIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import Editor from '@monaco-editor/react';

// Utility to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

function ImageManagement() {
  const [images, setImages] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    assetName: '',
    projectName: '',
    image: null
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // For code examples
  const [selectedTab, setSelectedTab] = useState(0);
  const [exampleCode, setExampleCode] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Map tab index to language
  const getLanguageFromTab = (tabIndex) => {
    const languages = ['html', 'javascript', 'python', 'php'];
    return languages[tabIndex];
  };

  // Code examples referencing "IMAGE_ID"
  const codeExamples = {
    html: `<!DOCTYPE html>
<html>
<body>
  <!-- Replace IMAGE_ID with your image ID -->
  <img id="dynamic-image" src="http://localhost:5000/api/images/IMAGE_ID" alt="My Image" />
  
  <p>This image is served via a redirect from the platform URL.</p>
</body>
</html>`,
    javascript: `/* Simple JS usage (e.g. in a script tag):
   Replace IMAGE_ID with your image ID.
   We can directly set "img.src = <platform URL>" 
*/

const myImg = document.getElementById("myImg");
myImg.src = "http://localhost:5000/api/images/IMAGE_ID";`,
    python: `import requests

# The /api/images/IMAGE_ID endpoint redirects to Cloudinary.
# Typically you'd embed it in HTML or a front-end, but here's an example:
image_url = "http://localhost:5000/api/images/IMAGE_ID"
print("Use this URL in an <img> tag, or fetch it for processing!")`,
    php: `<?php
// Just embed the redirect URL in an <img> or do further processing if needed
$imageUrl = "http://localhost:5000/api/images/IMAGE_ID";
echo "<img src='$imageUrl' alt='Dynamic Image' />";
?>`
  };

  // On mount, fetch images and init the example code with HTML
  useEffect(() => {
    fetchImages();
    setExampleCode(codeExamples.html);
  }, []);

  // Fetch images
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images', {
        headers: getAuthHeaders()
      });
      setImages(response.data);
    } catch (error) {
      showAlert('Error fetching images', 'error');
    }
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, image: event.target.files[0] });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Show or hide alerts
  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Handle image upload
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!formData.image || !formData.assetName || !formData.projectName) {
      showAlert('Please fill all fields', 'error');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', formData.image);
    uploadData.append('assetName', formData.assetName);
    uploadData.append('projectName', formData.projectName);

    try {
      await axios.post(
        'http://localhost:5000/api/images/upload',
        uploadData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      showAlert('Image uploaded successfully');
      setOpenUploadModal(false);
      setFormData({ assetName: '', projectName: '', image: null });
      fetchImages();
    } catch (error) {
      showAlert('Error uploading image', 'error');
    }
  };

  // Handle image update
  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!selectedImage) return;

    const updateData = new FormData();
    if (formData.image) {
      updateData.append('image', formData.image);
    }
    updateData.append('assetName', formData.assetName);
    updateData.append('projectName', formData.projectName);

    try {
      await axios.put(
        `http://localhost:5000/api/images/${selectedImage._id}`,
        updateData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showAlert('Image updated successfully');
      setOpenUpdateModal(false);
      setSelectedImage(null);
      setFormData({ assetName: '', projectName: '', image: null });
      fetchImages();
    } catch (error) {
      showAlert('Error updating image', 'error');
    }
  };

  // Open the update modal
  const handleOpenUpdateModal = (image) => {
    setSelectedImage(image);
    setFormData({
      assetName: image.assetName,
      projectName: image.projectName,
      image: null
    });
    setOpenUpdateModal(true);
  };

  // Copy URL
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => showAlert('URL copied to clipboard!'))
      .catch(() => showAlert('Failed to copy', 'error'));
  };

  // Tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Replace IMAGE_ID with selectedImageId if any
    const codeArray = Object.values(codeExamples);
    let newCode = codeArray[newValue];
    if (selectedImageId) {
      newCode = newCode.replace(/IMAGE_ID/g, selectedImageId);
    }
    setExampleCode(newCode);
  };

  // Editor change
  const handleEditorChange = (value) => {
    setExampleCode(value);
  };

  // On picking an image from dropdown
  const handleImageIdChange = (event) => {
    const newId = event.target.value;
    setSelectedImageId(newId);
    // Replace IMAGE_ID in example code with newId
    setExampleCode(exampleCode.replace(/IMAGE_ID/g, newId));
  };

  // "Run Example" -> for demonstration, we can show a preview text
  const executeCode = () => {
    if (!selectedImageId) {
      showAlert('Please select an image first', 'error');
      return;
    }
    setIsPreviewLoading(true);

    // A possible "preview" is just showing the direct link or some text
    // The route is a redirect, so we can't fetch JSON. We'll just show the final redirect link
    const htmlSnippet = `
    <img
      src="http://localhost:5000/api/images/${selectedImageId}"
      alt="Preview"
      style="max-width: 100%; height: auto;"
    />
 `;
    setTimeout(() => {
      setPreviewContent(htmlSnippet);
      setIsPreviewLoading(false);
    }, 1000);
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
    <div className="image-management">
      <style>
        {`
          .image-management {
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .upload-button {
            background-color:rgb(37, 97, 158) !important;
            color: white !important;
          }
          .table-container {
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(105, 21, 21, 0.1) !important;
          }
          .form-field {
            margin-bottom: 20px !important;
          }
          .file-input {
            margin: 20px 0;
          }
          .platform-url {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
          }
          .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
          }
          .preview-image {
            width: 100%;
            max-height: 200px;
            object-fit: contain;
            margin: 10px 0;
          }
          /* Editor & examples */
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
          .image-select {
            min-width: 200px;
          }
        `}
      </style>

      {/* Header */}
      <div className="header">
        <Typography variant="h5" component="h2">Image Management</Typography>
        <Button
          variant="contained"
          className="upload-button"
          onClick={() => setOpenUploadModal(true)}
        >
          Upload New Image
        </Button>
      </div>

      {/* Table of images */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Platform URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map((img) => (
              <TableRow key={img._id}>
                <TableCell>{img.assetName}</TableCell>
                <TableCell>{img.projectName}</TableCell>
                <TableCell>
                  <span className="platform-url" title={img.platformUrl}>
                    {img.platformUrl}
                  </span>
                  <IconButton
                    onClick={() => copyToClipboard(img.platformUrl)}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenUpdateModal(img)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Usage Examples */}
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
          <FormControl className="image-select">
            <InputLabel>Select Image</InputLabel>
            <Select
              value={selectedImageId}
              label="Select Image"
              onChange={handleImageIdChange}
            >
              {images.map((i) => (
                <MenuItem key={i._id} value={i._id}>
                  {i.assetName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={executeCode}
            className="execute-button"
            disabled={!selectedImageId || isPreviewLoading}
          >
            <PlayArrowIcon />
            Run Example
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
              <div dangerouslySetInnerHTML={{ __html: previewContent }} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Select an image and click "Run Example" to see a quick preview
              </Typography>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Upload New Image
          </Typography>
          <form onSubmit={handleUpload}>
            <TextField
              name="assetName"
              label="Asset Name"
              fullWidth
              className="form-field"
              value={formData.assetName}
              onChange={handleInputChange}
            />
            <TextField
              name="projectName"
              label="Project Name"
              fullWidth
              className="form-field"
              value={formData.projectName}
              onChange={handleInputChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="modal-buttons">
              <Button onClick={() => setOpenUploadModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Upload
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
            Update Image
          </Typography>
          {selectedImage && (
            <form onSubmit={handleUpdate}>
              <TextField
                name="assetName"
                label="Asset Name"
                fullWidth
                className="form-field"
                value={formData.assetName}
                onChange={handleInputChange}
              />
              <TextField
                name="projectName"
                label="Project Name"
                fullWidth
                className="form-field"
                value={formData.projectName}
                onChange={handleInputChange}
              />
              {selectedImage.cloudinaryUrl && (
                <img
                  src={selectedImage.cloudinaryUrl}
                  alt={selectedImage.assetName}
                  className="preview-image"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
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

export default ImageManagement;
