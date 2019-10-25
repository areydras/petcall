import React, { Component } from "react";
import Card from "../Components/Card";
import Header from "../Components/Header";
import Search from "../Components/Search";
import { Client } from "@petfinder/petfinder-js";
import BottomScrollListener from "react-bottom-scroll-listener";

const client = new Client({
  apiKey: "2Y9UArwgWV579LoxM4RRgos9UvKMvBM8O6BTD0U7hgrXDPHjSv",
  secret: "pufPGC5JTlUYOHuTOaflW5aUf4EjAUFQAcGthUor"
});

class Home extends Component {
  state = {
    animals: [],
    page: 1,
    onLoading: false,
    typeAnimals: [],
    filter: false,
    err: ""
  };

  componentDidMount = async () => {
    this.props.match.params.name ? await this.getPetName() : await this.getPet();
  };

  getPet = currentPage => {
    client.animal
      .search({ limit: 9, page: currentPage ? currentPage : this.state.page })
      .then(res => {
        let animals = [];
        currentPage
          ? (animals = [...this.state.animals, ...res.data.animals])
          : (animals = res.data.animals);
        this.setState({ animals, onLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ err });
      });
  };

  getPetName = currentPage => {
    client.animal
      .search({ name: this.props.match.params.name, limit: 9, page: currentPage ? currentPage : this.state.page })
      .then(res => {
        let animals = [];
        currentPage
          ? (animals = [...this.state.animals, ...res.data.animals])
          : (animals = res.data.animals);
        this.setState({ animals, onLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ err });
      });
  }

  handleSearch = text => {
    window.open(`/search/${text}`, "_blank");
  };

  morePages = () => {
    const nextPage = this.state.page + 1;
    this.setState({ onLoading: true, page: nextPage });
    if(this.props.match.params.name){
      this.getPetName(nextPage)
    }else if(this.state.filter){
      this.handleFilter({...this.state.filter, page: nextPage})
    }else{
      this.getPet(nextPage)
    }
  };

  handleFilter = filter => {
    this.setState({ animals: [] })
    client.animal.search(filter).then(res => {
      let animals = [];
      filter.page > 9
        ? (animals = [...this.state.animals, ...res.data.animals])
        : (animals = res.data.animals);
      this.setState({ animals, onLoading: false, filter:filter });
    })
  }

  handleClearFilter = () => {
    this.setState({ animals: [], filter: false })
    this.getPet()
  }
  
  render() {
    return (
      <BottomScrollListener onBottom={this.morePages}>
        <Header />
        <div
          className="row content container-fluid"
          style={{ margin: "0px !important" }}
        >
          <Search onHandleSearch={this.handleSearch} client={client} onHandleFilter={this.handleFilter} onHandleClear={this.handleClearFilter} />
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12">
            {this.props.match.params.name ? (
              <p style={{ marginTop: 8 }} className="text-center">
                Show result : {this.props.match.params.name}
              </p>
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",

                paddingBottom: 40
              }}
            >
              {!this.state.animals.length ? (
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ color: "#3C9D9B !important", marginTop: 20 }}
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                this.state.animals.map(animal => (
                  <Card
                    animal={animal}
                  />
                ))
              )}
              {this.state.onLoading ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ color: "#3C9D9B !important" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </BottomScrollListener>
    );
  }
}

export default Home;

