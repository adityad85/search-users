import React, { Component } from "react";
import "./App.css";
import { Input, Table, Avatar, Card } from "antd";
import { GitHubApiUrl, search, users } from "./constants/urls";
import axios from "axios";
import FlexCenteredDiv from "./StyledComponents/FlexCenteredDIv";
import errorNotify from "./helpers/notifyError";
import { DebounceInput } from "react-debounce-input";

const columns = [
  {
    title: "Image",
    dataIndex: "avatar_url",
    key: "avatar_url",
    render: image => <span>{<Avatar size={64} icon="user" src={image} />}</span>
  },
  {
    title: "Username",
    dataIndex: "login",
    key: "login"
  }
];

const debounceEvent = (callback, time = 250, interval) => 
  (...args) => {
    clearTimeout(interval, interval = setTimeout(() => callback(...args), time));
  }

class App extends Component {
  state = {
    userName: "",
    users: [],
    count: 0,
    errors: {}
  };

  emitEmpty = () => {
    this.setState(() => ({ userName: "" }));
  };

  onChangeUserName = async (e) => {
    const { value: searchQuery } = e.target;
    this.setState({ userName: searchQuery });

    if (searchQuery === "") {
      this.setState({
        users: [],
        count: 0,
        errors: {
          name: "Input is empty"
        }
      });
      return;
    }
    console.log(searchQuery);
      const generateParams = () => ({
        method: "GET",
        headers: { "Content-Type": "application/json" },
        "User-Agent": "adityad85"
      });
  
      const requestParams = generateParams();
  
      try {
        const {
          data: { items }
        } = await axios(
          `${GitHubApiUrl}/${search}/${users}?q=${searchQuery}&sort=followers`,
          requestParams
        );
        console.log("yo", items);
        this.setState({
          users: items,
          count: items.length,
          errors: {}
        });
      } catch (err) {
        this.setState({
          errors: {
            name: "Too Many Requests..."
          }
        });
        errorNotify('Please Wait before typing again');
      }
  };

  render() {
    const { userName, users, count } = this.state;
    return (
      <FlexCenteredDiv
        style={{
          backgroundColor: '#EEEEEE',
          minHeight: '100vh',
        }}>
        <Card style={{ width: "80vw" }}>
          <div>
          <DebounceInput
            placeholder="Enter username"
            value={userName}
            debounceTimeout={300}
            onChange={this.onChangeUserName}
            required
          />
          </div>
          <div>
            <div>
              {count} Users Found
            </div>
            <Table
              columns={columns}
              dataSource={users}
              rowKey={record => record.id}
            />
          </div>
        </Card>
      </FlexCenteredDiv>
    );
  }
}

export default App;
