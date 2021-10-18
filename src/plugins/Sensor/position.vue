<template>
    <div v-if="parentData.show">
        <div class="newDevice border-anim2" v-if="parentData.data.type == 2">
            <i class="animated  iconfont iconxiaoxi"></i>
            <span class="title">检测到一个新的{{parentData.data.device_name}}上线</span>
            <div class="border-anim2-edge border-anim2-left"></div>
            <div class="border-anim2-edge border-anim2-top"></div>
            <div class="border-anim2-edge border-anim2-right"></div>
            <div class="border-anim2-edge border-anim2-bottom"></div>
        </div>
        <div class="deviceAbnormal border-anim2" v-if="parentData.data.type == 1">
            <i class="animated  iconfont iconxiaoxi"></i><span class="title">检测到一个新设备【{{parentData.data.device_name}}】，信息不全，请前往补全</span>
            <i class="animated iconfont doudong iconyoujiantou"></i>
            <div class="border-anim2-edge border-anim2-left"></div>
            <div class="border-anim2-edge border-anim2-top"></div>
            <div class="border-anim2-edge border-anim2-right"></div>
            <div class="border-anim2-edge border-anim2-bottom"></div>
        </div>
        <div class="sensor" v-if="parentData.data.type == 1">
            <div class="item x">x:<span>{{parentData.position.x||0}}</span></div>
            <div class="item">y:<span>{{parentData.position.y||0}}</span></div>
            <div class="item">z:<span>{{parentData.position.z||0}}</span></div>
            <div class="submit btn" @click="updatePoint">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "position",
        props:['parentData'],
        methods:{
            /**
             * @author pengwei.zhao
             * @date 2020/07/29
             * @function updatePoint
             * @summary 更新点位信息
             */
             updatePoint(){
                this.parentData.request.put("http://172.30.81.120:18889/device/installed/update",{
                    "id":this.parentData.data.data.id,
                    "deviceCode":this.parentData.data.data.deviceCode,
                    "deviceInfoId":this.parentData.data.data.deviceInfoId,//产品id
                    "manufacturerId":this.parentData.data.manufacturerId,//厂商id
                    "editionId":this.parentData.data.data.editionId,//版本
                    "longitude":this.parentData.position.x,//经度
                    "latitude":this.parentData.position.z,//纬度
                    "height":this.parentData.position.y,//高度
                }).then(point => {
                    point.position = {
                        x:point.longitude||0,
                        y:point.height||0,
                        z:point.latitude||0
                    }
                    this.parentData.submit(point)
                    this.parentData.show = false;
                    this.parentData.gizmoManager.dispose();
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .border-anim2-edge {
        position: absolute;
        border: 0px solid #a2ffff;
        box-sizing: border-box;
        box-shadow: 1px 1px 5px 1px #54fbfb85;
    }
    .border-anim2-left {
        width: 1px;
        height: 100%;
        top:0;
        left: 0;
        border-left-width:0.5px;
        animation: anim2-border-run-left var(5s) calc(var(5s) / -2) linear infinite;
    }
    .border-anim2-top {
        height:1px;
        width: 100%;
        top: 0;
        left:0;
        border-top-width: 0.5px;
        animation: anim2-border-run-top var(5s) linear infinite;
    }

    .border-anim2-right {
        width: 1px;
        height: 100%;
        top:0;
        right: 0;
        border-right-width: 0.5px;
        animation: anim2-border-run-right var(5s) calc(var(5s) / -2) linear infinite;
    }
    .border-anim2-bottom {
        height: 1px;
        width: 100%;
        bottom: 0;
        left:0;
        border-bottom-width: 0.5px;
        animation: anim2-border-run-bottom var(5s) linear infinite;
    }
    .newDevice{
        position: absolute;
        top:10px;
        margin:auto;
        background: rgba(0, 255, 246, 0.42);
        color:#fff;
        padding:10px;
        left: calc(50% - 200px);
        font-size:14px;
        width:auto;
        border-radius: 4px;
        cursor: pointer;
        .iconfont{
            font-size: 14px;
            &.iconxiaoxi{
                animation:shake 2.5s infinite linear ;
                display: inline-block;
                transform-origin: 50% 0%;
            }
        }
        .title{
            padding-left:10px;
            display: inline-block;
        }
    }
    .deviceAbnormal{
        position: absolute;
        top:10px;
        margin:auto;
        background: rgba(255, 17, 17, 0.72);
        color:#fff;
        padding:10px;
        left: calc(50% - 200px);
        font-size:14px;
        width:400px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 2;
        .border-anim2-edge{
            border-color:red;
            box-shadow: 1px 1px 5px 1px red;
        }
        .iconfont{
            font-size: 14px;
        }
        .title{
            padding-left:10px;
            display: inline-block;
        }
        .iconxiaoxi{
            animation:shake 2.5s infinite linear ;
            display: inline-block;
            transform-origin: 50% 0%;
        }
        .iconyoujiantou{
            padding-left:10px;
            font-size: 16px;

            &:active{
                color:rgba(255,255,255,.5)
            }
        }
    }
    .sensor{
        position: absolute;
        right: 20px;
        top: 20px;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        background: #b9e4e54f;
        min-width: 150px;
        border: 1px solid #b9e4e5;
        box-shadow: 0px 0px 1px #b9e4e5;

        .item{
            padding:10px 0;
        }
        .submit{
            cursor: pointer;
            pointer-events: all;
            color: #50BCBF;
            display: inline-block;
            line-height: 1;
            border: 1px solid  #b9e4e5;
            text-align: center;
            white-space: nowrap;
            -webkit-appearance: none;
            margin: auto;
            box-sizing: border-box;
            outline: none;
            transition: 0.1s;
            font-weight: 500;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            padding: 8px 20px;
            font-size: 14px;
            border-radius: 4px;
            &:focus,&:hover{
                background: #50BCBF;
                border-color: #50BCBF;
                color: #FFFFFF;
            }
        }
    }
</style>