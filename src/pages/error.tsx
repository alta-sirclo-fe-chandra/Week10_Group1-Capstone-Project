import NotFound from "../assets/images/not-found.svg";

const Error = () => {
  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <img src={NotFound} alt="logo" height="200" />
      </div>
    </div>
  );
};

export default Error;
