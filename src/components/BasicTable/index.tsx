import { useCallback, useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'babylonjs';
import Table from 'components/Table';
import style from './index.module.scss';

interface IProps {
    data: any;
    point: Vector3
}

const BasicTable = (props: IProps) => {
    const [list, setList] = useState([]);
    const getScandaDataCallback = useCallback(async () => {
        try {
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        getScandaDataCallback()
    }, [getScandaDataCallback])

    const { data = {}, point = Vector3.Zero() } = props;
 
    const columns = useMemo(
        () => [
            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
        ],
        []
    )

    return (
        <div className={style.info} style={{ left: point.x, top: point.y }}>
            {/* <Table columns={columns} data={[{ firstName: data.ADDR, lastName: data.MATERIAL }]} /> */}
        </div>
    )
}

export default BasicTable;