import  { useState, useEffect } from 'react';
import './style.css';
import TableLIst from './TableLIst';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const [fileOwner, setFileOwner] = useState(null);
    const [fileUploaderEmail, setFileUploaderEmail] = useState(null); // Added state for email
    const [errorMessage, setErrorMessage] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authInProgress, setAuthInProgress] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded files

    useEffect(() => {
        const loadGAPI = () => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                console.log('Google API script loaded successfully');
            };
            document.body.appendChild(script);
        };

        loadGAPI();
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            setErrorMessage('Please upload a file');
            return;
        }
        setShowAuthModal(true);  // Show the authentication modal
    };

    const handleAuthSuccess = async (response) => {
        try {
            const token = response.credential; // Get the token from the response
            // Initialize the API client with the token
            await window.gapi.client.init({
                apiKey: 'AIzaSyCu9t_lcvVZLTtZGUqUWY3Xax8S1WVBeFE',
                clientId: '8215897379-lm42qmj0sv471dop6j71ge32u5oj2lp8.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive.file',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            });

            // Authenticate using the credential for auth
            await window.gapi.auth2.getAuthInstance().signIn({
                id_token: token
            });

            // Get user profile info (name, email)
            const user = window.gapi.auth2.getAuthInstance().currentUser.get();
            const profile = user.getBasicProfile();
            const userEmail = profile.getEmail(); // Get user's email
            uploadFileToDrive(token);
            setFileUploaderEmail(userEmail); // Store email

            // Now upload the file
            uploadFileToDrive(token);

        } catch (error) {
            console.error('Authentication failed:', error);
            setErrorMessage('Authentication failed. Please try again.');
            setUploading(false);
            setShowAuthModal(false);  // Close the modal if auth fails
        }
    };

    const uploadFileToDrive = () => {
        const file = selectedFile;

        setUploading(true);

        const fileMetadata = {
            name: file.name,
            mimeType: file.type,
        };
        const media = {
            mimeType: file.type,
            body: file,
        };

        const request = window.gapi.client.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, owners',
        });

        request.execute((response) => {
            if (response.error) {
                console.error('Error uploading file:', response.error);
                setErrorMessage('Error uploading file.');
            } else {
                setUploadedFileId(response.id);
                setFileOwner(response.owners[0].displayName);
                setUploadedFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        id: response.id,
                        name: file.name,
                        owner: response.owners[0].displayName,
                        uploaderEmail: fileUploaderEmail,  // Include email in the file metadata
                    }
                ]);
                alert('File uploaded successfully!');
            }
            setUploading(false);
            setShowAuthModal(false);  // Close the modal after uploading
        });
    };

    const initiateAuth = () => {
        if (authInProgress) return;
        setAuthInProgress(true);

        window.gapi.load('auth2', function () {
            const auth2 = window.gapi.auth2.init({
                client_id: '8215897379-lm42qmj0sv471dop6j71ge32u5oj2lp8.apps.googleusercontent.com',
            });

            auth2.signIn({ prompt: 'select_account' }).then(
                (googleUser) => {
                    console.log('googleUser', googleUser)
                    const token = googleUser.getAuthResponse().id_token;
                    handleAuthSuccess({ credential: token });
                },
                (error) => {
                    console.error('Error signing in:', error);
                    alert('Authentication failed. Please try again.');
                    setAuthInProgress(false);
                    setShowAuthModal(false);  // Close modal on failure
                }
            );
        });
    };

    return (
        <div className="container">
            <h5 className="center-align text-title">Upload Files to Google Drive</h5>

            <div className="upload-section">
                <label htmlFor="file-upload" className="upload-file-btn">Choose File</label>
                <input
                    id="file-upload"
                    className="upload-file"
                    type="file"
                    onChange={handleFileChange}
                />

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )} &nbsp;
                <button className="upload-button" onClick={handleFileUpload}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>

                {/* Show selected file name below the file input */}
                {selectedFile && (
                    <div className="selected-file-info">
                        Selected File: {selectedFile.name}
                    </div>
                )}

                {uploadedFileId && (
                    <div className="uploaded-file-info">
                        File uploaded! ID: {uploadedFileId} <br />
                        Uploaded by: {fileOwner} (Email: {fileUploaderEmail})
                    </div>
                )}
            </div>

            {/* Authentication Modal */}
            {showAuthModal && (
                <div className="auth-modal">
                    <div className="auth-modal-content">
                        <h4 className='auth-title-text'>Authenticate</h4>
                        <p className='auth-pharagraph-text'>Please sign in with your Google account to upload the file.</p>
                        <div className="auth-modal-actions">
                            <button
                                className="auth-modal-close"
                                onClick={() => setShowAuthModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="auth-modal-authenticate"
                                onClick={initiateAuth}
                            >
                                Authenticate
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <br /><br />
            {/* Static List of Files with uploader names */}
            < TableLIst />
            {/* List of Uploaded Files */}
            <div className="static-files-list">
                <h6 className="static-files-title">Uploaded Files</h6>
                {uploadedFiles.length > 0 ? (
                    <ul className="static-files-ul">
                        {uploadedFiles.map((file, index) => (
                            <li className="static-file-item" key={index}>
                                <i className="file-icon docx-icon"></i>
                                <span className="file-name">{file.name}</span>
                                <span className="file-owner">{file.uploaderEmail}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-pharagraph'>No files uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
