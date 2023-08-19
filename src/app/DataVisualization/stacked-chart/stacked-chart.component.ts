import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as D3 from 'd3';

@Component({
  selector: 'app-stacked-chart',
  templateUrl: './stacked-chart.component.html',
  styleUrls: ['./stacked-chart.component.scss']
})
export class StackedChartComponent implements OnInit {
  @ViewChild('ChartContainer') private chartContainer: ElementRef<SVGElement>;

  @Input() data: StackedChart[];

  private w: number = 600;
  private h: number = 400;
  private divH: number = 375;
  private halfLength: number;
  private margin = { top: 10, right: 50, bottom: 80, left: 50 };
  private width = this.w - this.margin.left - this.margin.right;
  private height = this.h - this.margin.top - this.margin.bottom;

  private x0: any;
  private x1: any;
  private y0: any;
  private y1: any;
  private svg: any;
  private g: any;
  private stack: any;
  private chart: any;
  private layersBarArea: any;
  private layersBar: any;
  private x0Axis: any;
  private x1Axis: any;
  private y0Axis: any;
  private y1Axis: any;
  private legend: any;
  private legendItems: any;
  private tooltip: any;
  private stackedSeries: any;
  private layersDivs: any;
  private layersBlockArea: any;
  private valueline: any;
  private lineArea: any;
  private pageX: any;
  private pageY: any;

  private colors = ['yellow', 'green', 'blue'];
  constructor(private container: ElementRef) { }

  ngOnInit(): void {
    this.stack = D3.stack()
      .keys(['one', 'two', 'three', 'four'])

    this.initScales();
    this.initSvg();
    this.drawAxis();
    this.createStack(stackedChart);
  }

  /////////////// initScales

  private initScales() {
    this.x0 = D3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.05);

    this.y0 = D3.scaleLinear()
      .range([this.height, 0])

    this.x1 = D3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.05);  

    this.y1 = D3.scaleLinear()
      .range([this.height, 0])
  }

/////////////// initSvg

  private initSvg() {
    const element = this.chartContainer.nativeElement;
    this.tooltip = D3.select('body').append("div")
      .classed('chart-tooltip', true)
      .style('display', 'none');

    this.svg = D3.select(element)
      // .select('.chart-container')
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr('class', 'chart')
      .attr("viewBox", "0 0 600 400")
      .style('background-color', '#fffeee');

    this.chart = this.svg.append('g')
      .classed('chart-contents', true)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.layersBarArea = this.chart.append('g')
      .classed('layers', true);

  }


/////////////// drawAxis


  private drawAxis() {
    this.x0Axis = this.chart.append('g')
      .classed('x-axis', true)
      .attr("transform", "translate(0," + this.height + ")")
      .call(D3.axisBottom(this.x0))

    this.y0Axis = this.chart.append('g')
      .classed('y0-axis', true)
  }

/////////////// createStack

  private createStack(stackData: any) {
    this.stackedSeries = this.stack(stackData);
    this.drawChart(this.stackedSeries)
  }

/////////////// drawChart

  private drawChart(data: any) {
    this.layersBar = this.layersBarArea.selectAll('.layer')
      .append('rect')
      .data(data)
      .enter()
      .append('g')
      .classed('layer', true)
      .style('fill', (d: any, i: any) => {
        return this.colors[i]
      });

    this.x0.domain(this.data.map((d: any) => {
      return d.date
    }));

    this.chart.select('.x-axis').call(D3.axisBottom(this.x0))

    this.y0.domain([0, +D3.max(this.stackedSeries, function (d: any) {
      return D3.max(d, (d: any) => {
        return d[1]
      })
    })]);
    this.chart.select('.y0-axis').call(D3.axisLeft(this.y0))

    let bars = this.layersBar.selectAll('rect')
      .data((d: any) => {
        return d;
      })
      .enter()
      .append('rect')

      .attr('y', (d: any) => {
        //return this.y0(d[1])
        return this.y0(0)
      })

      .attr('width', this.x0.bandwidth() * 0.95 * 0.5)

      .attr('x', (d: any, i: any) => {
        return (this.x0(d.data.date) + (i % 2) * 0.525 * this.x0.bandwidth());
      })

      .attr('height', 0);

    bars.transition()
      .ease(D3.easeCubic)
      .duration(1000)
      .attr('height', (d: any, i: any) => {
        return this.y0(d[0]) - this.y0(d[1]);
      })
      .attr('y', (d: any) => {
        return this.y0(d[1])
      })

    bars.on("mouseover", ()=>{
			D3.select('.chart-tooltip').style("display", null)
			})
			.on("mouseout", ()=>{
				D3.select('.chart-tooltip').style("display", "none")
			})
			.on("mousemove", (d:any)=>{
				D3.select('.chart-tooltip')
					.style("left", this.width + 15 + "px")
					.style("top", this.height - 25 + "px")
					.text(d[1] - d[0]);
          
			});    
  }


}

interface StackedChart {
  one: number,
  two: number,
  three: number,
  date: string,
  type: string
}

interface LineChart {
  date: string,
  value: number
}

const stackedChart: StackedChart[] = [
  {
     "date": "Jan",
     "type":"Left",
     "one":54,
     "two":287,
     "three":147
  },
  {
     "date": "Jan",
     "type":"Right",
     "one":545,
     "two":27,
     "three":487
  }
 ,
 {
     "date": "Feb",    
     "type":"Left",
     "one":143,
     "two":288,
     "three":424
 },
 {
     "date": "Feb",
     "type":"Right",
     "one":191,
     "two":209,
     "three":345
 },
  {
     "date": "Mar",
     "type":"Left",
     "one":148,
     "two":27,
     "three":147
  },
  {
     "date": "Mar",
     "type":"Right",
     "one":386,
     "two":286,
     "three":287
  }
 ,
 {
     "date": "Apr",    
     "type":"Left",
     "one":13,
     "two":286,
     "three":924
 },
 {
     "date": "Apr",
     "type":"Right",
     "one":121,
     "two":209,
     "three":345
 }
]

// https://stackblitz.com/edit/d3-tooltip?embed=1&file=src/app/bar-chart.ts&hideNavigation=1