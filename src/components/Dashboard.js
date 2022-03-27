import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      focused: null
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
    console.log("Class: The component mounted")
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({focused});
    }
  }
  componentDidUpdate(previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
    console.log('Class: The component updated');
  }



  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {
      return <Loading />;
    }
    const panelList = data
      .filter(panel => this.state.focused === null || this.state.focused === panel.id)
      .map(panel => {
        return (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.value}
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
