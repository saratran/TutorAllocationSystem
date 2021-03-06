import { Button, Grid } from "@material-ui/core";
import React, { Component } from "react";
import baseApi from "../apis/baseApi";
import ReadFileFormat from "../services/ReadFileFormat";
import { Props, State } from "../type";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import "./styles/DragDrop.css";

/*
this file puts together the drag and drop componenet for the TPS Section
from Component(react), ReadfileFormat, and DragDropPresentation
*/

class TpsDragDrop extends Component<Props, State> {
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  fileFormats: ReadFileFormat = new ReadFileFormat();
  readonly validTypes: String[];
  csvFile: File = new File(["foo"], "placeholder.txt");

  //Constructor:
  constructor(props: Props) {
    super(props);
    this.state = { dragging: false, file: null };
    this.validTypes = this.fileFormats.getFormats();
  }

  dragEventCounter: number = 0;
  dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    // listener for the drag feature to TPS files slot
    this.overrideEventDefaults(event);
    this.dragEventCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ dragging: true });
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === "Files"
    ) {
      // This block handles support for IE - if you're not worried about
      // that, you can omit this
      this.setState({ dragging: true });
    }
  };

  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    // listener for the drag feature interrupt
    this.overrideEventDefaults(event);
    this.dragEventCounter--;

    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    //drop listener to indicate a file upload to the allocate file slot
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });
    this.hideSuccess();

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (this.validTypes.indexOf(event.dataTransfer.files[0].type) === -1) {
        console.log("not accepted file");
        // have to prompt user here
      } else {
        this.setState({ file: event.dataTransfer.files[0] });
        this.csvFile = event.dataTransfer.files[0];
      }
    }
  };

  obtainResult = (results: any) => {
    //move the data of the file to allocateList
    this.allocateList = results.data;
  };

  uploadData = async () => {
    // // Send file to the backend when upload is CHOSEN
    try {
      const formData = new FormData();
      formData.append("tps", this.csvFile);
      await baseApi.post("/upload/tps", formData);
    } catch (err) {
      throw err;
    }

    this.showSuccess();
  };

  //success message:
  showSuccess = () => {
    document.getElementById("TPS_fb")!.style.visibility = "visible";
  };

  hideSuccess = () => {
    document.getElementById("TPS_fb")!.style.visibility = "hidden";
  };

  clearField = () => {
    this.hideSuccess();
    this.setState({ file: null });
    this.fileUploaderInput = null;
    const inputElement: HTMLInputElement = document.getElementById(
      "input_3"
    ) as HTMLInputElement;
    inputElement.value = "";
  };

  //override
  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  //if file changes:
  onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.hideSuccess();
    if (event.target.files && event.target.files[0]) {
      this.setState({ file: event.target.files[0] });
    }
    if (event.target.files && event.target.files[0]) {
      if (this.validTypes.indexOf(event.target.files[0].type) === -1) {
        console.log("not accepted file");
        // have to prompt user here
      } else {
        this.setState({ file: event.target.files[0] });
        this.csvFile = event.target.files[0];
      }
    }
  };

  //if file is clicked:
  onFileClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    element.value = "";
    this.hideSuccess();
  };

  //on ComponentDidMount:
  componentDidMount() {
    window.addEventListener("dragover", (event: Event) => {
      this.overrideEventDefaults(event);
    });
    window.addEventListener("drop", (event: Event) => {
      this.overrideEventDefaults(event);
    });
  }

  //on Componenet willUnmount:
  componentWillUnmount() {
    window.removeEventListener("dragover", this.overrideEventDefaults);
    window.removeEventListener("drop", this.overrideEventDefaults);
  }

  //render the ui components
  render() {
    return (
      <div className="Dragdrop">
        <h2>TPS Uploader</h2>
        <FileUploaderPresentationalComponent
          dragging={this.state.dragging}
          file={this.state.file}
          onDrag={this.overrideEventDefaults}
          onDragStart={this.overrideEventDefaults}
          onDragEnd={this.overrideEventDefaults}
          onDragOver={this.overrideEventDefaults}
          onDragEnter={this.dragenterListener}
          onDragLeave={this.dragleaveListener}
          onDrop={this.dropListener}
        >
          <Grid container justify="flex-end">
            <input
              id="input_3"
              ref={(el) => (this.fileUploaderInput = el)}
              type="file"
              className="file-uploader__input"
              onChange={this.onFileChanged}
              accept=".csv"
              onClick={this.onFileClick}
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Button
              className="clear_button"
              id="Sbutton5"
              variant="contained"
              onClick={this.clearField}
              type="button"
            >
              Clear
            </Button>
            <Button
              className="submit_button"
              id="Sbutton6"
              variant="contained"
              onClick={this.uploadData}
              type="button"
            >
              Submit
            </Button>
          </Grid>
          <div>
            <h3 className="success_feedback" id="TPS_fb">
              TPS file uploaded!
            </h3>
          </div>
        </FileUploaderPresentationalComponent>
      </div>
    );
  }
}

export default TpsDragDrop;
