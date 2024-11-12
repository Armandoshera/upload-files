
const TableLIst = () => {

    return (
        <div className="static-files-list">
            <h6 className="static-files-title">Uploaded Files</h6>
            <ul className="static-files-ul">
                <li className="static-file-item">
                    <i className="file-icon pdf-icon"></i>
                    <span className="file-name">File1.pdf</span>
                    <span className="file-owner">(Uploaded by: johndoe1@gmial.com)</span>
                </li>
                <li className="static-file-item">
                    <i className="file-icon docx-icon"></i>
                    <span className="file-name">File2.docx</span>
                    <span className="file-owner">(Uploaded by: johndoe2@gmial.com)</span>
                </li>
                <li className="static-file-item">
                    <i className="file-icon txt-icon"></i>
                    <span className="file-name">File3.txt</span>
                    <span className="file-owner">(Uploaded by: johndoe3@gmial.com)</span>
                </li>
            </ul>
        </div>
    );

}
export default TableLIst;