import { Vector3 } from 'babylonjs';
import style from './index.module.scss';

interface IProps {
    data: any;
    point: Vector3
}

const BasicInfo = (props: IProps) => {

    const { data = {}, point = Vector3.Zero() } = props;

    return (
        <div className={style.info} style={{ left: point.x, top: point.y }}>
            <ul>
                {
                    Object.keys(data).map(key => <li key={key}>
                        <span className={style.label}>{key}: </span>
                        <span className={style.value}>{data[key]}</span>
                    </li>)
                }
            </ul>
        </div>
    )
}

export default BasicInfo;