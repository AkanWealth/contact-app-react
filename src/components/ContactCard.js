import React from "react";
import { Link } from "react-router-dom";

const CardContact = (props) => {
  const { id, name, email } = props.contact;
  return (
    <div className="item">
      <i className="large middle aligned circle icon user"></i>
      <div className="content">
        <Link
          to={{ pathname: `/contact/${id}`, state: { contact: props.contact } }}
        >
          <div className="header">{name}</div>
          <div>{email}</div>
        </Link>
      </div>
      <i
        className="trash alternate outline icon"
        style={{
          color: "red",
          float: "right",
          marginTop: "-23px",
          marginLeft: "10px",
        }}
        onClick={() => props.removeContact(id)}
      ></i>
      <Link to={{ pathname: `/edit`, state: { contact: props.contact } }}>
        <i
          className="edit alternate outline icon"
          style={{
            color: "blue",
            float: "right",
            marginRight: "35px",
            marginTop: "-23px",
          }}
        ></i>
      </Link>
    </div>
  );
};

export default CardContact;
