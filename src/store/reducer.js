import * as actionType from "./action"

const initialState = {
    authStatus: false,
    authUser: null,
    guard: null,
    employee: null,
    visitor: null,
    log: null,
    imageUrl: "http://api-gate-pass.basukalaiti.com/",
}

const reducerAdmin = (state = initialState, action) =>{
    switch(action.type){
        case actionType.LOGIN:
            return {...state, authStatus: true, authUser: action.data}
        case actionType.LOGOUT:
            return {...state, authStatus: false, authUser: null}
        case actionType.GETGUARD:
            return {...state, guard: action.guard}
        case actionType.GETEMPLOYEE:
            return {...state, employee: action.employee}
        case actionType.GETVISITOR:
            return {...state, visitor: action.visitor}
        case actionType.GETLOG:
            return {...state, log: action.log}
        default:
            return state
    }
}

export default reducerAdmin;