import moment from 'moment';

type wfoEmployee = {
  image: string;
  employee: string;
  wfoDate: string;
  wfoLocation: string;
}

const EmployeeCard = (wfoEmployee: wfoEmployee) => {
  return (
    <div className="card row" style={{height: '50px', marginLeft: '1px', width: '98%', border: 'none'}}>
      <div className="d-flex justify-content-center align-items-center" style={{width: '15%', height: 'inherit', padding: '0'}}>
        <img src={wfoEmployee.image} width="30px" height="30px" alt='' style={{borderRadius: "50%"}}/>
      </div>
      <div className="card-body" style={{width: '85%', margin: '0', padding: '0'}}>
        <strong style={{fontSize: '0.9rem'}}>{wfoEmployee.employee}</strong>
        <div className="text-muted" style={{fontSize: '0.75rem'}}>
          {moment(wfoEmployee.wfoDate).format('dddd, MMMM Do YYYY')} @ {wfoEmployee.wfoLocation}
        </div>
      </div>
    </div>
  )
}

export default EmployeeCard;
