import React from "react"
const TaskList = (props) => {
  return (
    props.taskList.map((val, idx) => {
      let vac_type = `vac_type-${idx}`, admin_date = `admin_date-${idx}`, exp_date = `exp_date-${idx}`, vac_number = `vac_number-${idx}`
      return (
        <tr key={val.index}>
          <td>
            <select name="vac_type" required id={vac_type} data-id={idx} className="form-control" >
              <option key='0'></option>
            {props.vaccinations.map(vac_type => 
              <option key={vac_type.vaccine_name}>{vac_type.vaccine_name}</option>
            )}
              
              {/* <option value="pending">Pending</option>
              <option value="In Progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Hold">Hold</option> */}
            </select>
          </td>
          <td>
            <input type="date"  required name="admin_date" id={admin_date} data-id={idx} className="form-control " />
          </td>
          <td>
            <input type="date"  required name="exp_date" id={exp_date} data-id={idx} className="form-control " />
          </td>
          <td>
            <input type="text"  name="vac_number" data-id={idx} id={vac_number} className="form-control " />
          </td>
          <td>
            {/* {
            idx===0?<button onClick={()=>props.add()} type="button" className="btn btn-primary text-center">Add</button>
            : <button className="btn btn-danger" onClick={(() => props.delete(val))} >Remove</button>
            } */}
            <button onClick={()=>props.add()} type="button" className="btn btn-primary text-center">Add</button>
            <button className="btn btn-danger" onClick={(() => props.delete(val))} >Remove</button>
          </td>
        </tr >
      )
    })
  )
}
export default TaskList