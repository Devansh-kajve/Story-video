import "./App.css";
import Form from "./Components/Form";
import ImageUpload from "./Components/ImageUpload";
import Video from "./Components/Video";

function App() {
  const handleImageUpload = (file) => {
    // Here you can perform actions with the uploaded file, such as displaying it or sending it to a server
    console.log("Uploaded file:", file);
  };
  return (
    <div className="App">
      {/* <ImageUpload onUpload={handleImageUpload} /> */}
      <Form />
      {/* <Video /> */}
    </div>
  );
}

export default App;
