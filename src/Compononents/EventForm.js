import React, { useState, useEffect, useRef } from "react";
import '../App.css';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FiClock } from "react-icons/fi";
import { FaClock, FaRunning, FaWalking} from "react-icons/fa";
import axios from "axios";
// Schema for yup

const Gloop = ({coordinates}) => {
  const [formValues, setFormValues] = useState({ name:"", email: "", phone:"", blog:"", latitude: coordinates["lat"], longitude: coordinates["lng"], tag:"sporting_event"}); 


  const submitEvent = async() => {
    
    try {
      let event = {
          title: formValues.name,
          description: formValues.email,
          date: new Date(),
          tag: formValues.tag,
          location: {
            latitude: coordinates["lat"], 
            longitude: coordinates["lng"]
          },
          max_capacity: 10,
          public: true,
          attending: [
          {
          first_name: "John",
          last_name: "Doe",
          email: "jdoe@mail.com"
          }
          ],
          upvotes: 2,
          comment_ids: [ ],
          rating: 5,
          status: "active",
          creator_id: "0"
        };
        
      let res = await axios.post('https://sparkdev-underline.herokuapp.com/events/register', event); 
  
      console.log(res); 
    } catch (err) {
        console.log(err);
    }
  }

  
// Schema for yup


// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "*Names must have at least 2 characters")
    .max(100, "*Names can't be longer than 100 characters")
    .required("*Name is required"),
  email: Yup.string()
    .min(2, "*Names must have at least 2 characters")
    .max(100, "*Description can't be longer than 100 characters")
    .required("*Event Description is required"),
  phone: Yup.string()
    .matches(phoneRegExp, "*Phone number is not valid"),
  blog: Yup.string()
  .min(2, "*Names must have at least 2 characters")
  .max(100, "*Names can't be longer than 100 characters")
});


return(
  <React.Fragment>
    <Container>
      <Formik
        initialValues={{ name:"", email:"", phone:"", blog:"", latitude: 1, longitude: 1, tag:"sporting_events"}}
        validationSchema={validationSchema}
        onSubmit={(values, {setSubmitting, resetForm}) => {
            // When button submits form and form is in the process of submitting, submit button is disabled
            setSubmitting(true);
            
            // Resets form after submission is complete
            resetForm();

            // Sets setSubmitting to false after form is reset
            setSubmitting(false);
           // Simulate submitting to database, shows us values submitted, resets form
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            resetForm();
            setSubmitting(false);
          }, 500); 
        }}
      >

        {/* Callback function containing Formik state and helpers that handle common form actions */}
        {({ values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="mx-auto">
              {setFormValues(values)}
              <Form.Group controlId="formName">
                <Form.Label>Event Name :</Form.Label>
                <Form.Control
                  type="text"
                  /* This name property is used to access the value of the form element via values.nameOfElement */
                  name="name"
                  placeholder="Full Name"
                  /* Set onChange to handleChange */
                  onChange={handleChange}
                  /* Set onBlur to handleBlur */
                  onBlur={handleBlur}
                  /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                  value={values.name}
                  /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                  className={touched.name && errors.name ? "error" : null}
                />
                {touched.name && errors.name ? (
                  <div className="error-message">{errors.name}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Event Description :</Form.Label>
                <Form.Control
                  as="textarea" 
                  rows={3}
                  name="email"
                  placeholder="Yoga in the park"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className={touched.email && errors.email ? "error" : null}

                />
                {touched.email && errors.email ? (
                  <div className="error-message">{errors.email}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone :</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  className={touched.phone && errors.phone ? "error" : null}
                />
                {touched.phone && errors.phone ? (
                  <div className="error-message">{errors.phone}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formBlog">
                <Form.Label>Invite Friends :</Form.Label>
                <Form.Control
                  type="text"
                  name="blog"
                  placeholder="Joe Jack"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.blog}
                  className={touched.blog && errors.blog ? "error" : null}
                />
                
              </Form.Group>
              
              <Form.Group controlId="formBlog">
                  <Form.Label>Tag</Form.Label>
                  <Form.Control className="Icon-Selector"as="select"  onChange={($event) =>(values.tag = $event.target.value)}
                    onBlur={handleBlur} >
                    <option value={"sporting_events"}>Sporting Events</option>
                    <option value={"food_events"}>Food Events</option>
                    <option value={"art_expo"}>Art Expo</option>
                    <option value={"music_show"}>Music Show</option>
                    <option value={"restroom"}>Restroom</option>
                  </Form.Control>    
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting} onClick={submitEvent}>
                Submit
              </Button>
            </Form>
          )}
      </Formik>
    </Container>
  </React.Fragment>
)
}

export default Gloop;