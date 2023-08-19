import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
    @ViewChild('ChartContainer') private chartContainer: ElementRef;
    constructor() {}

    ngOnInit(): void {
      // this.lineChart();
    }

    padding = [20, 30];

    data: IData[] = [
        {date: 0, value: 0},
        {date: 10, value: 20},
        {date: 20, value: 60},
        {date: 30, value: 30},
        {date: 40, value: 80},
        {date: 50, value: 90},
        {date: 60, value: 40},
        {date: 70, value: 60},
        {date: 80, value: 50}
    ];

    lineChart(): void {
        const element = this.chartContainer.nativeElement;
        let width = 500;
        let height = 400;
        const svg = d3
            .select(element)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background-color', '#F6F9FE');

        let xAxis = d3
            .scaleLinear()
            .domain([0, 100])
            .range([0 + this.padding[1], width - this.padding[0]]);

        svg.append('g')
            .attr(
                'transform',
                'translate(0,' + (height - this.padding[1]) + ')'
            )
            .call(make_x_gridlines());

        let yAxis = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height - this.padding[1], 0 + this.padding[0]]);

        svg.append('g')
            .attr('transform', 'translate(' + this.padding[1] + ', 0)')
            .call(d3.axisLeft(yAxis));

        svg.append('g')
            .attr('class', 'grid')
            .attr(
                'transform',
                'translate(0,' + (height - this.padding[1]) + ')'
            )
            .call(
                make_x_gridlines().tickSize(
                    -(height - this.padding[1] - this.padding[0])
                )
            )
            .style('color', 'grey')
            .style('opacity', 0.2)
            .selectAll('text')
            .remove();

        svg.append('path')
            .datum(this.data)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr(
                'd',
                d3
                    .line<IData>()
                    .x((d) => xAxis(d.date))
                    .y((d) => yAxis(d.value))
            );

        svg.selectAll('circle-group')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', (d) => xAxis(d.date))
            .attr('cy', (d) => yAxis(d.value))
            .attr('r', 5)
            .attr('fill', '#8FE182');

        svg.selectAll('vertical-lines')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('x', (d) => xAxis(d.date) - 45 / 2)
            .attr('y', this.padding[0])
            .attr('width', '45px')
            .attr('height', height - this.padding[0] - this.padding[1])
            .attr('fill', 'transparent')
            .style('cursor', 'pointer')
            .on('mouseover', (d) => {
                svg.append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('left', xAxis(d.date) - 50 + 'px')
                    .style('top', '-20px')
                    .style('background-color', 'white')
                    .style('color', 'black')
                    .style('padding', '5px 0px')
                    .style('border-radius', '5px')
                    .style('width', '100px')
                    .style('text-align', 'center')
                    .html(`${d.value}`);
            })
            .on('mouseout', function () {
                svg.selectAll('.tooltip').remove();
            });

        function make_x_gridlines() {
            return d3.axisBottom(xAxis);
        }
    }
}

interface IData {
    date: number;
    value: number;
}
