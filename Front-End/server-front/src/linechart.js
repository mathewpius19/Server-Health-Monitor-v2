import React, { Component } from "react";
import * as d3 from "d3";
import { color, line } from "d3";
import {LegendOrdinal, LegendItem, LegendLabel} from "@vx/legend";
import {  scaleOrdinal  } from '@vx/scale';

const width = 600;
const height = 400;
const margin = {top:20, right:5, bottom:20, left:35};


const ordinalColorScale = scaleOrdinal({
    domain: ["real","predicted"],
    range:["red", "blue"]
})

const legendGlyphSize = "100%";
class Chart extends Component{
    state={
        line1:[],
        line2:[],
        line3:[],
    }
    xAxis1=d3.axisBottom();
    xAxis2=d3.axisBottom();
    xAxis3=d3.axisBottom();
    yAxis1=d3.axisLeft();
    yAxis2=d3.axisLeft();
    yAxis3=d3.axisLeft();
    
    static getDerivedStateFromProps(nextProps, prevState){
        const { data } = nextProps;
        if(!data){
            return {};
        }
        // console.log(value)
        const xScale = d3.scaleTime().range([margin.left,width-margin.right]);
        const yScale1 = d3.scaleLinear().range([height-margin.bottom,margin.top])
        const yScale2 = d3.scaleLinear().range([height-margin.bottom,margin.top])
        const yScale3 = d3.scaleLinear().range([height-margin.bottom,margin.top])
         
   
            //new Date(d.Epoch_Time*1000).toLocaleString().split(' ')[0]

        //Set Domains on Scales

        const timeDomain = d3.extent(data, d=>d.Epoch_Time*1000)
        const bytesReadDomain = d3.extent(data, d=>(d.Bytes_Read))
        const bytesWriteDomain = d3.extent(data, d=>d.Bytes_Write)
        const bytesSentDomain = d3.extent(data, d=>d.Bytes_Sent)
        xScale.domain(timeDomain)
        yScale1.domain(bytesReadDomain)
        yScale2.domain(bytesWriteDomain)
        yScale3.domain(bytesSentDomain)

         
        //Create and use line generator to plot the line charts

        const lineGenerator = d3.line().x(d=>xScale(d.Epoch_Time*1000))
        
        const line1 = [
            {
                path:lineGenerator.y((d)=>yScale1((d.Bytes_Read)))(data)
            },
            {
                path:lineGenerator.y((d)=>yScale1((d.P_Read)|0))(data)
            }
        ];
        const line2 = [
            {
                path:lineGenerator.y((d)=>yScale2((d.Bytes_Write)))(data)
            },
            {
                path:lineGenerator.y((d)=>yScale2((d.P_Write)|0))(data)
            }
        ]
        const line3=[
            {
                path:lineGenerator.y((d)=>yScale3((d.Bytes_Sent)))(data)
            },
            {
                path:lineGenerator.y((d)=>yScale3((d.P_Sent)|0))(data)
            }
        ]
        return {line1,line2,line3, xScale, yScale1,yScale2,yScale3};
    }

    componentDidUpdate(){
        if(this.state.line1.length===0){
            return{}
        }
        else{
        this.xAxis1.scale(this.state.xScale);
        d3.select(this.refs.xAxis1).call(this.xAxis1);
        
        this.xAxis2.scale(this.state.xScale);
        d3.select(this.refs.xAxis2).call(this.xAxis2);
        
        this.xAxis3.scale(this.state.xScale);
        d3.select(this.refs.xAxis3).call(this.xAxis3);

        this.yAxis1.scale(this.state.yScale1);
        d3.select(this.refs.yAxis1).call(this.yAxis1);
        
        this.yAxis2.scale(this.state.yScale2);
        d3.select(this.refs.yAxis2).call(this.yAxis2);
        
        this.yAxis3.scale(this.state.yScale3);
        d3.select(this.refs.yAxis3).call(this.yAxis3);

    }
}

    

    render(){
        return(
            
                <div className="center" >
                    <h3 className="center header"> Line Charts</h3>
                    <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label.toUpperCase()}`}>
                        {labels=>{
                            return(
                            <div className="legend-content">
                                {labels.map((label,i)=>{
                                    return(
                                        <LegendItem
                                        key={`legend-quantile-${i}`}
                                        margin='0 5px'
                                        >
                                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                                <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                                            </svg>
                                            <LegendLabel align="left" margin ="0 0 0 4px">
                                                {label.text}
                                            </LegendLabel>
                                        </LegendItem>
                                    )
                                })}
                            </div>
                            )}}
                    </LegendOrdinal>
                    
                    
                <p className="center">Bytes Read By Disk vs Time</p>
                <svg>
                    
                    <g>
                        {this.state.line1.map((d,i)=>{
                            
                                return <path d={d.path} fill="none" stroke="red" />
                            
                           
                        })}
                    </g>
                    <g ref="xAxis1" transform={`translate(0,${height-margin.bottom})`} g/>
                    <g ref="yAxis1" transform={`translate(${margin.left},0)`} g/>

                </svg>
                
                <p className="center ">Bytes Written by Disk vs Time</p>
                
                <svg>
                    
                    <g>
                        {this.state.line2.map((d,i)=>{
                            
                                return <path d={d.path} fill="none" stroke="blue" />
                           
                            
                        })}
                    </g>
                    <g ref="xAxis2" transform={`translate(0,${height-margin.bottom})`} g/>
                    <g ref="yAxis2" transform={`translate(${width},0)`} g/>

                </svg>

                <p className="center">Bytes Sent by Server vs Time</p>
                <svg>
                    
                    <g>
                        {this.state.line3.map((d,i)=>{
                            
                                return <path d={d.path} fill="none" stroke = "purple" />
                            
                        })}
                    </g>
                    <g ref="xAxis3" transform={`translate(0,${height-margin.bottom})`} g/>
                    <g ref="yAxis3" transform={`translate(${margin.left},0)`} g/>

                </svg>
                </div>
           
        )
    }
}
export default Chart;



