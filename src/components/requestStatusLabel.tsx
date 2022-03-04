type requestStatus = {
  content: string;
}

const RequestStatusLabel = (requestStatus: requestStatus) => {
  return (
    <div className="d-flex justify-content-center" 
      style={{width: "fit-content", backgroundColor: "lightgrey", color: "grey", 
        borderRadius: "20px", fontSize: "0.7rem", paddingLeft: "10px", paddingRight: "10px"}}>
      {requestStatus.content}
    </div>
  )
}

export default RequestStatusLabel;
