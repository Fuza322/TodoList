import React, {useCallback, useEffect} from 'react'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import moment from 'moment'
import {useDispatch} from 'react-redux'
import {fetchTasksTC} from './Task/tasks-reducer'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import {ProgressBar} from './ProgressBar/ProgressBar'
import {Task} from './Task/Task'
import {Button, ButtonGroup, IconButton} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
import style from './Todolist.module.scss'

type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    changeTaskDescription: (taskId: string, newDescription: string, todolistId: string) => void
    changeTaskDeadline: (taskId: string, newDeadline: string, todolistId: string) => void
    changeTaskPriority: (taskId: string, newPriority: number, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: TodolistPropsType) {

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(props.todolist.id))
    }, [demo, dispatch, props.todolist.id])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask, props.todolist.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolist.id)
    }, [props.removeTodolist, props.todolist.id])

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.todolist.id, props.changeFilter])

    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div className={style.todolistBlock}>
            <div className={style.todolistContainer}>
                <div className={style.todolistTitleContainer}>
                    <EditableSpan
                        value={props.todolist.title}
                        onChange={changeTodolistTitle}
                        editableSpanInputStyle={style.todolistTitleEditableSpanInput}
                        editableSpanTextStyle={style.todolistTitle}
                    />
                    <div className={style.todolistDisplay}>
                        <span>{props.todolist.addedDate ? moment(props.todolist.addedDate).format('L') : null}</span>
                        <IconButton className={style.todolistDeleteButton} onClick={removeTodolist}
                                    disabled={props.todolist.entityStatus === 'loading'}>
                            <Delete fontSize='inherit'/>
                        </IconButton>
                    </div>
                </div>
                <AddItemForm addItem={addTask}
                             disabled={props.todolist.entityStatus === 'loading'}
                             addItemInputStyle={style.todolistInput}
                />
                <div>
                    {tasksForTodolist.map(t =>
                        <Task key={t.id}
                              task={t}
                              todolistId={props.todolist.id}
                              changeTaskStatus={props.changeTaskStatus}
                              changeTaskTitle={props.changeTaskTitle}
                              changeTaskDescription={props.changeTaskDescription}
                              changeTaskDeadline={props.changeTaskDeadline}
                              changeTaskPriority={props.changeTaskPriority}
                              removeTask={props.removeTask}
                        />)
                    }
                </div>
                <div className={style.todolistFilterContainer}>
                    <ButtonGroup color={'primary'}
                                 className={style.buttonGroupContainer}>
                        <Button variant={props.todolist.filter === 'all' ? 'contained' : 'outlined'}
                                onClick={onAllClickHandler}
                                color={'default'}
                                className={style.buttonFilter}>All
                        </Button>
                        <Button variant={props.todolist.filter === 'active' ? 'contained' : 'outlined'}
                                onClick={onActiveClickHandler}
                                color={'primary'}
                                className={style.buttonFilter}>Active
                        </Button>
                        <Button variant={props.todolist.filter === 'completed' ? 'contained' : 'outlined'}
                                onClick={onCompletedClickHandler}
                                color={'secondary'}
                                className={style.buttonFilter}>Completed
                        </Button>
                    </ButtonGroup>
                </div>
                <ProgressBar tasks={props.tasks}/>
            </div>
        </div>
    )
})


