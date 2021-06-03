import React, {useCallback, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {AppRootStateType} from '../../app/store'
import {useDispatch, useSelector} from 'react-redux'
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from './todolists-reducer'
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from './Todolist/Task/tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import Particles from 'react-particles-js'
import Masonry from 'react-masonry-css'
import style from './TodolistsList.module.scss'

type TodolistsListPropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsTC())
    }, [demo, isLoggedIn, dispatch])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(id, todolistId))
    }, [dispatch])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title, todolistId))
    }, [dispatch])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(id, {status}, todolistId))
    }, [dispatch])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC(id, {title: newTitle}, todolistId))
    }, [dispatch])

    const changeTaskDescription = useCallback(function (id: string, newDescription: string, todolistId: string) {
        dispatch(updateTaskTC(id, {description: newDescription}, todolistId))
    }, [dispatch])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    const particlesOptions = {
        'particles': {
            'number': {'value': 80, 'density': {'enable': true, 'value_area': 800}},
            'color': {'value': '#0085eb'},
            'shape': {
                'type': 'circle',
                'stroke': {'width': 0, 'color': '#000000'},
                'polygon': {'nb_sides': 5}
            },
            "opacity": {
                'value': 0.5,
                'random': false,
                'anim': {'enable': false, 'speed': 1, 'opacity_min': 0.1, 'sync': false}
            },
            'size': {
                'value': 10,
                'random': true,
                'anim': {'enable': false, 'speed': 40, 'size_min': 0.1, 'sync': false}
            },
            'line_linked': {'enable': true, 'distance': 150, 'color': '#0085eb', 'opacity': 0.4, 'width': 1},
            'move': {
                'enable': true,
                'speed': 0.4,
                'random': false,
                'straight': false,
                'bounce': false,
                'attract': {'enable': false, 'rotateX': 600, 'rotateY': 1200}
            }
        }
    }

    const breakpointColumnsObj = {
        default: 4,
        1450: 3,
        1100: 2,
        800: 1
    };

    return (
        <div className={style.todolistsListBlock}>
            <Particles className={style.particles} params={particlesOptions}/>
            <div data-aos='fade-right' data-aos-duration='600' className={style.todolistsListInputContainer}>
                <AddItemForm
                    addItem={addTodolist}
                    addItemInputStyle={style.todolistsListInput}
                />
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className={style.todolistslits}
                columnClassName={style.todolistColumnItem}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id]
                        return (
                            <Todolist
                                key={tl.id}
                                todolist={tl}
                                tasks={allTodolistTasks}
                                changeTaskStatus={changeStatus}
                                changeTaskTitle={changeTaskTitle}
                                changeTaskDescription={changeTaskDescription}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        )
                    })
                }
            </Masonry>
        </div>
    )
}
