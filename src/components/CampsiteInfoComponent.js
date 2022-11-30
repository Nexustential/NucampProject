import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader, Label, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {

    state= {
        isModalOpen: false,
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }


    render () {
        return (
            <>
                <Button onClick={this.toggleModal} className='fa fa-pencil fa-lg' outline>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className='form-group'>
                                    <Label htmlFor='rating' className='d-inline-flex ml-3'>Rating</Label>
                                        <Col className="col-md-12">
                                            <Control.select className='form-control' model='.rating' id='rating' name='rating'>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                        </Col>
                                </Row>
                                <Row className='form-group'>
                                    <Label htmlFor='name' className='d-inline-flex ml-3'>Your Name</Label>
                                        <Col className="col-md-12">
                                            <Control.text className='form-control' name='author' id='author' model='.author' placeholder='Your Name' 
                                                validators={{
                                                    required,
                                                    minLength: minLength(2),
                                                    maxLength: maxLength(15)
                                                }}
                                            
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                component="div"
                                                messages={{
                                                    minLength: 'Must be at least 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                            />
                                        </Col>
                                </Row>
                                <Row className='form-group'>
                                    <Label htmlFor='text' className='d-inline-flex ml-3'>Comment</Label>
                                        <Col md={12}>
                                            <Control.textarea className='text col-md-12' name='text' id='text' model='.text' placeholder='Type Comment'>
                                            
                                            </Control.textarea>
                                        </Col>
                                </Row>
                                <Row className='form-group'>
                                        <Col>
                                            <Button color='primary'>Submit</Button>
                                        </Col>
                                </Row>
                            </LocalForm>
                        </ModalBody>
                </Modal>
            </>
        )
    }

}

function RenderCampsite({campsite}) {
    return (
        <div className='col-md-5 m-1'> 
            <FadeTransform 
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}
    
function RenderComments({comments, postComment, campsiteId}) {
    if (comments) {
        return (
            <div className='col-md-5 m-1'>
                <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}<br />
                                        {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>    
        );
    } 
    return <div />   
}
    
function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }

    if (props.errMess) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

    if(props.campsite) {
        return ( 
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className='row'>
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments} 
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );    
    }
    return <div />
}

export default CampsiteInfo;