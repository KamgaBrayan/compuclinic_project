import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HistogramChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: [],
      sumEntree: 0,
      sumSortie: 0,
      sumBilan: 0,
    };
    this.addSymbols = this.addSymbols.bind(this);
  }

  addSymbols(e) {
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);

    if (order > suffixes.length - 1)
      order = suffixes.length - 1;

    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  setData(i, typeDonnee) {
    //var services=['service 1', 'service 2','service 3'] ;
    var values= this.props.values
    var services=[] ;
    var serviceInput ={ };
    var serviceOutput ={ };
    var indice = 0 ; 
    for (let val of values) {
      services.push(val[0]);
      serviceInput[`service${indice + 1}`]= val[1]; 
      serviceOutput[`service${indice + 1}`]= val[1];
      indice++;
    }
  /*  var serviceInput = {
      service1: [12, 250, 1000, 13000],
      service2: [10, 200, 800, 15000],
      service3: [15, 300, 1200, 11000],
      service4: [8, 170, 700, 10000],
      service5: [13, 350, 1300, 14000],
    };
    var serviceOutput = {
      service2: [12, 250, 1000, 13000],
      service1: [10, 200, 800, 15000],
      service5: [15, 300, 1200, 11000],
      service3: [8, 170, 700, 10000],
      service4: [13, 350, 1300, 14000],
    };*/

    var data = services.map((service, index) => {
      if (typeDonnee === "entree") {
        return {
          service: service,
          entree: serviceInput[`service${index + 1}`][i],
        };
      } else if (typeDonnee === "sortie") {
        return {
          service: service,
          sortie: serviceOutput[`service${index + 1}`][i],
        };
      } else if (typeDonnee === "bilan") {
        return {
          service: service,
          bilan: serviceInput[`service${index + 1}`][i] - serviceOutput[`service${index + 1}`][i],
        };
      } else {
        return {
          service: service,
          entree: serviceInput[`service${index + 1}`][i],
          sortie: serviceOutput[`service${index + 1}`][i],
          bilan: serviceInput[`service${index + 1}`][i] - serviceOutput[`service${index + 1}`][i],
        };
      }
    });
  
    // Calcul de la somme des entrées, sorties et bilans
    var sumEntree=0 ;
    var sumSortie=0 ;
    var sumBilan=0 ;
  
    
  
    if (typeDonnee === "entree") {
      sumEntree = data.reduce((acc, curr) => (curr.entree || 0) + acc, 0);
      this.setState({ 
        dataPoints: data,
        sumEntree: sumEntree,
     });
    }else if (typeDonnee === "sortie") {
      sumSortie = data.reduce((acc, curr) => (curr.sortie || 0) + acc, 0);
      this.setState({ 
        dataPoints: data,
        sumSortie: sumSortie,
     });
    }else if (typeDonnee === "bilan") {
      sumBilan = data.reduce((acc, curr) => (curr.bilan || 0) + acc, 0);
      this.setState({ 
        dataPoints: data, 
        sumBilan: sumBilan,
     });
    }else  {
      sumEntree = data.reduce((acc, curr) => (curr.entree || 0) + acc, 0);
      sumSortie = data.reduce((acc, curr) => (curr.sortie || 0) + acc, 0);
      sumBilan = data.reduce((acc, curr) => (curr.bilan || 0) + acc, 0);
      this.setState({ 
        dataPoints: data,
        sumEntree: sumEntree,
        sumSortie: sumSortie,
        sumBilan: sumBilan,
     });
    }
    
  }

  componentDidMount() {
    this.setData(this.props.i || 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.i !== prevProps.i) {
      this.setData(this.props.i || 0);
    }
  }

  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      title: {
        text: ""
      },
      theme: this.props.darkMode ? "dark2" : "light2",
      legend: {
        cursor: "pointer",
        fontSize: 15,
      },
      axisY: {
        includeZero: true,
        labelFormatter: this.addSymbols,
        scaleBreaks: {
          autoCalculate: true
        }
      },
      data: this.props.typeDonnee === 'entree' ? [
        {
          type: "column",
          name: `${this.props.nomDonnee}`,
          showInLegend: true,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.entree
          }))
        }
      ] : this.props.typeDonnee === 'sortie' ? [
        {
          type: "column",
          name: `Total sortie: ${this.state.sumSortie}`,
          showInLegend: true,
          opacity: 0.5,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.sortie
          }))
        }
      ] : this.props.typeDonnee === 'bilan' ? [
        {
          type: "column",
          name: `Total bilan: ${this.state.sumBilan}`,
          showInLegend: true,
          opacity: 0.5,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.bilan
          }))
        }
      ] : [
        {
          type: "column",
          name: `Total entrée: ${this.state.sumEntree}`,
          showInLegend: true,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.entree
          }))
        },
        {
          type: "column",
          name: `Total sortie: ${this.state.sumSortie}`,
          showInLegend: true,
          opacity: 0.5,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.sortie
          }))
        },
        { 
          type: "column",
          name: `Total bilan: ${this.state.sumBilan}`,
          showInLegend: true,
          opacity: 0.5,
          indexLabelFontColor: "#5A5757",
          barWidth: 0.2, 
          indexLabelPlacement: "outside",
          dataPoints: this.state.dataPoints.map(point => ({
            label: point.service,
            y: point.bilan
          }))
        }
      ]
    }

    return (
      <div>
        <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
      </div>
    );
  }
}

export default HistogramChart;
