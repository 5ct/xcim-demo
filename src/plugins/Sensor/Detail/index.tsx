import React from 'react';
import style from './index.module.scss';

interface IconProps {
    onClick?:((event: any) => void) | undefined,
    info?:any
}

interface Icontates {
    data?:any,
    left:string,
    top:string
}

class Icon extends React.Component<IconProps, Icontates> {
    private chart:any;
    constructor(props: IconProps) {
        super(props);
        this.state = {
            left:'0px',
            top:"0px",
            data:{}
        }
    }
    
    public init():void{
    }

    private format(date:Date, pattern:string):any {
        date = new Date(date);
        if (!date || !pattern) {
            return;
        }
        pattern = pattern || 'yyyy-MM-dd';

        function padding(s:any, len:number) {
            len = len - (s + '').length;
            for (var i = 0; i < len; i++) {
                s = '0' + s;
            }
            return s;
        }
        return pattern.replace(/([yMdhsm])(\1*)/g,($0:any) => {
            switch ($0.charAt(0)) {
                case 'y':
                    return padding(date.getFullYear(), $0.length);
                case 'M':
                    return padding(date.getMonth() + 1, $0.length);
                case 'd':
                    return padding(date.getDate(), $0.length);
                case 'w':
                    return date.getDay() + 1;
                case 'h':
                    return padding(date.getHours(), $0.length);
                case 'm':
                    return padding(date.getMinutes(), $0.length);
                case 's':
                    return padding(date.getSeconds(), $0.length);
            }
        });
    }
    componentDidMount(){
       
    }
    
    render() {
        let {info} = this.state.data;
        return (
            <div>
                {info?<div className={style.detail}  style={{left:this.state.left,top: this.state.top}}>
                    <div className={style.close} onClick={() => {this.setState({data:{}})}}>

                    </div>
                    <div className={style.header}>
                        <span className={style.arrow}>
                            <span className={style.line}></span>
                            <span className={style.line}></span>
                        </span>
                        <span className={style.info}>{info.deviceName}信息</span>
                    </div>
                    <div className={style.detailInfo}>
                        <div className={style.item}>产品名称：{info.deviceName}</div>
                        <div className={style.item}>厂商名称：{info.manufacturerName}</div>
                        <div className={style.item}>使用场景：{info.useCase}</div>
                        <div className={style.item}>建议行动：{info.function}</div>
                    </div>
                    <div className={style.charts} ref={(ref) => {this.chart = ref}}></div>
                </div>:null
            }
            </div>
        )
    }
}
export default Icon;