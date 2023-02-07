import axios from "axios";

export default {
    actions: {
        async fetchDataGridRows(/* context = */ { commit, state }) {
            let dataGridRows = [];
            let dataGridRowsCount = 0;
            const requestBody = {
                paging: {
                    skip: (state.pagingData.pageNumber - 1) * state.pagingData.pageSize, // вычисляем сколько строк нужно "пропустить"
                    take: state.pagingData.pageSize
                },
                sorting: {
                    [state.sorting.sortColumn]: state.sorting.sortDirection
                },
                filtering: state.filter
            };
            await axios
                .post(state.dataSourceUri, requestBody)
                .then((response) => {
                    dataGridRows = response.data.documents;
                    dataGridRowsCount = response.data.count;

                    commit('refreshDataGridRows', dataGridRows);
                    commit('updateDataGridRowsCount', dataGridRowsCount);
                })
                .catch((error) => {
                    console.log('process.env.VUE_APP_BACKEND_APP_URL: ', process.env.VUE_APP_BACKEND_APP_URL);
                    console.log('process.env.VUE_APP_BACKEND_APP_PORT: ', process.env.VUE_APP_BACKEND_APP_PORT);
                    console.log('Случилось что-то очень нехорошее при загрузке данных:', error)
                }
                );
        }
    },
    mutations: {
        refreshDataGridRows(state, dataGridRows) {
            state.dataGridRows = dataGridRows;
        },
        updateDataGridRowsCount(state, dataGridRowsCount) {
            state.dataGridRowsCount = dataGridRowsCount
        },
        updatePageSize(state, pageSize) {
            state.pagingData.pageSize = pageSize
        },
        updatePageNumber(state, pageNumber) {
            state.pagingData.pageNumber = pageNumber
        },
        updateSortColumn(state, sortColumn) {
            state.sorting.sortColumn = sortColumn
        },
        updateSortDirection(state, sortDirection) {
            state.sorting.sortDirection = sortDirection
        },
        addNewColumnDataToFilter(state, columnData) {
            // Добавляем абсолютно все фильтры, даже с пустыми значениями для фильтрации (valueToFilter). 
            // Учитывать данный фильтр или нет будем уже на бэкенде
            state.filter[columnData.columnName] = {
                columnType: columnData.columnType,
                comparisonOperator: columnData.comparisonOperator,
                valueToFilter: columnData.valueToFilter,
            };
        },
    },
    state: {
        dataGridRows: [],
        dataGridRowsCount: null,
        dataSourceUri: `http://${process.env.VUE_APP_BACKEND_APP_URL}:${process.env.VUE_APP_BACKEND_APP_PORT}/documents/findPaginated`, // Получаем данные от локального сервера
        // dataSourceUri: "https://ydr7yx.sse.codesandbox.io/documents/findPaginated", // Получаем данные от сервера песочницы с backend-приложением
        sorting: {
            sortColumn: "createdOn",
            sortDirection: "DESC",
        },
        pagingData: {
            pageSize: 5,
            pageNumber: 1,
        },
        filter: {}
    },
    getters: {
        dataGridRows(state) {
            return state.dataGridRows;
        },
        dataGridRowsCount(state) {
            return state.dataGridRowsCount;
        },
        pagingData(state) {
            return state.pagingData;
        },
        pageSize(state) {
            return state.pagingData.pageSize;
        },
        pageNumber(state) {
            return state.pagingData.pageNumber;
        },
        sortColumn(state) {
            return state.sorting.sortColumn;
        },
        sortDirection(state) {
            return state.sorting.sortDirection;
        },
        filter(state) {
            return state.filter;
        }
    },
}