import React, { Component } from "react";
import classnames from "classnames";
import axios from 'axios';
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      focused: null,
      days: [],
      appointments: {},
      interviewers: {}
    };
    this.selectPanel = this.selectPanel.bind(this);
  }

  // selectPanel = function(id) {
  //   this.setState({focused: id});
  // }

  // selectPanel(id) {
  //   this.setState({focused: id});
  // }

  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  componentDidMount() {
    console.log("Class: The component mounted");
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({focused});
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      this.setState({
        loading: false,
        days,
        appointments, 
        interviewers
      })
    })
  }
  componentDidUpdate(previousState) {
    console.log('Class: The component updated');
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }



  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {
      console.log(this.state);
      return <Loading />;
    }
    console.log(this.state);
    const panelList = data
      .filter(panel => this.state.focused === null || this.state.focused === panel.id)
      .map(panel => {
        return (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.getValue(this.state)}
            onSelect={(event) => this.selectPanel(panel.id)}
          />
        );
      })
    return (
      <main className={dashboardClasses}>
        {panelList}
      </main>
    );
  }
}

export default Dashboard;
