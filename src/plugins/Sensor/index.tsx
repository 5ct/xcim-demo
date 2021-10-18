import React from 'react';
import axios from 'utils/axios';

import {
    Engine,
    Scene,
    Vector3,
    Matrix,
    Mesh,
    MeshBuilder
} from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import Icon from "./Icon";
import Detail from "./Detail";
interface Point {
    longitude:number,
    latitude:number,
    height:number,
    position:Vector3,
    deviceCode:string
}
interface ELPoint{
    mesh:Mesh,
    icon?:Icon|null
}
interface IState {
    labels:any,
    detail?:any
}

interface IProps {
    scene: Scene;
}

export default class Sensor extends React.Component<IProps, IState> {
    public scene: Scene;
    public engine: Engine;
    public points:[ELPoint] = [] as any;
    public activeMesh:Mesh = null as any;
    private $detail?:Detail|null;

    constructor(props: IProps) {
        super(props);
        this.scene = props.scene;
        this.engine = props.scene.getEngine();
        this.state = {
            labels:[]
        }
        this.getPoints();
    }
/**
     * @author pengwei.zhao
     * @date 2020/07/29
     * @function getPoints
     * @summary 获取点位信息
     */
    private getPoints():void{
        console.info("=========================")
        axios.get('http://172.30.81.120:18889/device/installed/info').then((res:any) => {
            console.info("http://172.30.81.120:18889/device/installed/info")
            if(res.data){
                this.renderPoint(res.data);
            }
        })
    }
     /**
     * @author pengwei.zhao
     * @date 2020/07/29
     * @function renderPoint
     * @summary 渲染点位
     */
    private renderPoint(points:Array<Point>):void{
        this.setState({
            labels:points.map((point:Point,index:number) => {
                point.position = new Vector3(point.longitude,point.height,point.latitude)
                return this.createLabel(point,index);
            })
        },() => {
            let {scene} = this;
            // 创建实例，挂载到文档以后的地方
            scene.registerBeforeRender(() => {
                this.points.forEach((elp:ELPoint) => {
                    let point = this.getPointByMesh(elp.mesh)
                    elp.icon?.setState({
                        left:(point.x - 15)+"px",
                        top:(point.y - 140)+"px"
                    })
                })
                if(this.activeMesh){
                    let point = this.getPointByMesh(this.activeMesh);
                    this.$detail?.setState({
                        left:point.x,
                        top:point.y
                    })
                }
            })
        })
    }
    
    private getPointByMesh(mesh:any):any{
        return Vector3.Project(mesh.absolutePosition,Matrix.Identity(),this.scene.getTransformMatrix() as any,this.scene.activeCamera!.viewport.toGlobal(document.body.clientWidth,document.body.clientHeight));
    }
     /**
     * @author pengwei.zhao
     * @date 2020/07/29
     * @function createLabel
     * @summary 场景中创建提示图片、文字、连线
     */
    private createLabel(point:Point,index:number):any {
        // 创建一个内置的“球”体；其构造函数的参数：名称、宽度、深度、精度，场景，其中精度表示表面细分数。
        let mesh:Mesh = MeshBuilder.CreateSphere(point.deviceCode, {}, this.scene);
        // 设置球体位置，使其位于平面之上
        mesh.position.copyFrom(point.position);
        this.points.push({
            mesh:mesh
        });
        this.createGUILabel(mesh);
        return<Icon key={index} onClick={() => this.showDetail(mesh,point)} ref={ref => (this.points[index].icon = ref)} ></Icon>;
    }
    /**
     * @author pengwei.zhao
     * @date 2020/07/29
     * @function getPointDetail
     * @summary 获取点位详情
     */
    private async showDetail(mesh:Mesh,data:any):Promise<void>{
        this.activeMesh = mesh;
        await axios.get("http://172.30.81.120:18889/device/installed/all?id="+data.id+"&deviceInfoId="+data.deviceInfoId+"&editionId="+data.editionId+"").then((res:any) => {
            if(res.data){
                this.$detail?.setState({
                    data:res.data
                },() => {
                    this.$detail?.init();
                })
            }
        })
    }
      /**
     * @author pengwei.zhao
     * @date 2020/07/29
     * @function initGUILabel
     * @summary 场景中创建提示图片、文字、连线
     */
    private createGUILabel(mesh:any) {
        // GUI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var label = new GUI.Rectangle("label for " + mesh.name);
        label.height = "20px";
        label.width = "100px";
        label.color = "#56FFD3";
        label.cornerRadius = 20;
        label.thickness = 0;
        label.linkOffsetY = -70;
        label.top = 20;
        advancedTexture.addControl(label);
        label.linkWithMesh(mesh);

        var line = new GUI.Line();
        line.alpha = 0.5;
        line.lineWidth = 3;
        line.dash = [5, 2];
        line.y1 = -10;
        line.y2 = 10;
        advancedTexture.addControl(line);
        line.linkWithMesh(mesh);
        line.connectedControl = label;


        var text1 = new GUI.TextBlock();
        text1.text = mesh.name;
        text1.textWrapping= true;
        text1.textVerticalAlignment = 1;
        text1.color = "#56FFD3";
        label.addControl(text1);
    }
    componentDidMount() {
       
    }


    render() {
        return (
            <div>
                {this.state.labels}
                <Detail ref={(ref) => {this.$detail = ref}}></Detail>
            </div>
        )
    }

}