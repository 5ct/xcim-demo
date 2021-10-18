import * as TweenMax from "../js/TweenMax.min";
import "../js/DrawSVGPlugin.min";

import React from 'react';
import style from './index.module.scss';
import Artboard1 from '../img/Artboard1.png';
interface Point {
    longitude:number,
    latitude:number,
    height:number,
    position:{
        x:number,
        y:number,
        z:number
    },
    deviceCode:string
}

interface IconProps {
    onClick?:((event: any) => void) | undefined
}

interface Icontates {
    left:string,
    top:string
}

class Icon extends React.Component<IconProps, Icontates> {
    constructor(props: IconProps) {
        super(props);
        this.state = {
           left:'0px',
           top:"0px"
        }
    }
    componentDidMount(){
        let myTween = TweenMax.fromTo("#test", 1, {drawSVG:"0% "},{drawSVG:"80% 100%"});
        myTween.repeat(-1);
    }
    render() {
        return (
            <div className={style.icon} style={{left:this.state.left,top:this.state.top}} onClick={this.props.onClick}>
                <svg  className={style.svgIcon} version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <filter x="-17.5%" y="-17.5%" width="135.0%" height="135.0%" filterUnits="objectBoundingBox" id="filter-2">
                        <feMorphology radius="1.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                        <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                        <feMorphology radius="1.5" operator="erode" in="SourceAlpha" result="shadowInner"></feMorphology>
                        <feOffset dx="0" dy="0" in="shadowInner" result="shadowInner"></feOffset>
                        <feComposite in="shadowOffsetOuter1" in2="shadowInner" operator="out" result="shadowOffsetOuter1"></feComposite>
                        <feGaussianBlur stdDeviation="3" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                        <feColorMatrix values="0 0 0 0 0.266666667   0 0 0 0 0.843137255   0 0 0 0 0.71372549  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                    </filter>
                    <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#226053" stroke-width="3" stroke-dasharray="165" />
                    <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#4ce0b9" stroke-width="1" filter="url(#filter-2)" stroke-dasharray="165" stroke-dashoffset="100" stroke-linecap="round"  id="test" />
                </svg>
                <img className={style.img} src={Artboard1}/>
            </div>
        )
    }
}
export default Icon;