import React, { Component } from 'react';
import axios from "axios"; // Import Axios for making HTTP requests
import { Card, Header, Form, Input, Icon } from "semantic-ui-react"; // Import Semantic UI React components

let endpoint = "https://todo-react-golang-monogdb.onrender.com"; // Define API endpoint

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: "", // State to hold the task input value
            items: [], // State to hold the list of tasks
        };
    }

    // Lifecycle method called after the component is mounted
    componentDidMount() {
        this.getTask(); // Fetch tasks from the server
    }

    // Function to handle input change
    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value, // Update the task state with input value
        });
    }

    // Function to handle form submission
    onSubmit = () => {
        let { task } = this.state;

        if (task) {
            // Send POST request to create a new task
            axios.post(endpoint + "/api/tasks", { task }, {
                headers: {
                    "Content-Type": "application/json", // Set request headers
                },
            }).then((res) => {
                this.getTask(); // Fetch updated tasks
                this.setState({
                    task: "", // Clear task input field
                });
                console.log(res); // Log response
            }).catch((error) => {
                console.error('Error creating task:', error); // Log error if any
            });
        }
    }

    // Function to fetch tasks from the server
    getTask = () => {
        axios.get(endpoint + "/api/tasks").then((res) => {
            if (res.data) {
                // Update state with fetched tasks
                this.setState({
                    items: res.data.map((item) => {
                        let color = "yellow"
                        let style = {
                            wordWrap: "break-word"
                        };

                        if (item.status) {
                            color = "green";
                            style["textDecorationLine"] = "line-through";
                        }

                        return (
                            // Render task as a Semantic UI Card component
                            <Card key={item._id} color={color} fluid className="rough">
                                <Card.Content>
                                    <Card.Header textAlign="left">
                                        <div style={style}>{item.task}</div>
                                    </Card.Header>

                                    <Card.Meta textAlign="right">
                                        {/* Icons for completing, undoing, and deleting tasks */}
                                        <Icon name="check circle" color='green' onClick={() => this.updateTask(item._id)} />
                                        <span style={{ paddingRight: 10 }}>Done</span>
                                        <Icon name="history" color='blue' onClick={() => this.undoTask(item._id)} />
                                        <span style={{ paddingRight: 10 }}>Undo</span>
                                        <Icon name="delete" color='red' onClick={() => this.deleteTask(item._id)} />
                                        <span style={{ paddingRight: 10 }}>Delete</span>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        )
                    })
                })
            } else {
                this.setState({
                    items: [],
                });
            }
        }).catch((error) => {
            console.error('Error fetching tasks:', error); // Log error if any
        });
    };

    // Function to mark a task as complete
    updateTask = (id) => {
        axios.put(endpoint + "/api/tasks/" + id, null, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            console.log(res);
            this.getTask(); // Fetch updated tasks
        }).catch((error) => {
            console.error('Error updating task:', error); // Log error if any
        });
    };

    // Function to mark a task as incomplete
    undoTask = (id) => {
        axios.put(endpoint + "/api/undoTask/" + id, null, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            console.log(res)
            this.getTask(); // Fetch updated tasks
        }).catch((error) => {
            console.error('Error undoing task:', error); // Log error if any
        });
    };

    // Function to delete a task
    deleteTask = (id) => {
        axios.delete(endpoint + "/api/deleteTask/" + id, {
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => {
            console.log(res);
            this.getTask(); // Fetch updated tasks
        }).catch((error) => {
            console.error('Error deleting task:', error); // Log error if any
        });
    };

    // Render method to render JSX
    render() {
        return (
            <div>
                <div className='row'>
                    {/* Header for the to-do list */}
                    <Header className="header" as="h2" color="yellow">
                        To do List
                    </Header>
                </div>
                <div className="row">
                    {/* Form to add a new task */}
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder="Create Task"
                        />
                    </Form>
                </div>
                <div className="row">
                    {/* Display the list of tasks as Semantic UI Cards */}
                    <Card.Group>{this.state.items}</Card.Group>
                </div>
            </div>
        );
    }
}

export default TodoList;
