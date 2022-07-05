export default {
    state: {
        commonTableOptions: {
            borders: {
                top: {
                    borderTopWidth: "2px",
                    borderTopStyle: "solid",
                    borderTopColor: "rgb(188, 188, 188)"
                },
                right: {
                    borderRightWidth: "2px",
                    borderRightStyle: "solid",
                    borderRightColor: "rgb(188, 188, 188)"
                },
                bottom: {
                    borderBottomWidth: "2px",
                    borderBottomStyle: "solid",
                    borderBottomColor: "rgb(188, 188, 188)"
                },
                left: {
                    borderLeftWidth: "2px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "rgb(188, 188, 188)"
                },
            },
            collapse: { borderCollapse: "collapse" }
        },
        headerOptions: {
            cursor: "pointer",
            background: "rgb(39, 58, 100)",
            color: "rgb(205, 205, 205)",
            height: "50px"
        },
        headerCellsOptions: {
            borderLeftWidth: "thin",
            borderLeftStyle: "solid",
            borderLeftColor: "rgb(153, 153, 153)"
        },
        filterOptions: {
            borders: {
                top: {
                    borderTopWidth: "2px",
                    borderTopStyle: "solid",
                    borderTopColor: "rgb(188, 188, 188)"
                },
                bottom: {
                    borderBottomWidth: "2px",
                    borderBottomStyle: "solid",
                    borderBottomColor: "rgb(188, 188, 188)"
                },
            }
        },
        filterCellsOptions: {
            borderLeftWidth: "thin",
            borderLeftStyle: "solid",
            borderLeftColor: "rgb(153, 153, 153)"
        },
        columnOptions: {
            borders: {
                borderLeftWidth: "thin",
                borderLeftStyle: "solid",
                borderLeftColor: "rgb(221, 221, 221)"
            },
            horizontalAlign: {
                textAlign: "center"
            },
            // Данное свойство выравнивает по горизонтали (по центру) текст в элементе input типа number,
            // т.к. по умолчанию текст в этом элементе выравнен по левому краю   
            numberInputHorizontalAlign: {
                textAlign: "center"
            },
            columns: [
                {
                    type: "number",
                    name: "id",
                    caption: "Id",
                    width: "150px",
                    padding: "0px",
                    input: {
                        width: "150px",
                        readonly: true
                    }
                },
                {
                    type: "text",
                    name: "cipher",
                    caption: "Шифр документа",
                    width: "400px",
                    padding: "0px 10px 0px 10px",
                    input: {
                        width: "-webkit-fill-available",
                        readonly: true
                    }
                },
                {
                    type: "datetime-local",
                    name: "createdOn",
                    caption: "Дата создания",
                    width: "250px",
                    padding: "0px",
                    input: {
                        width: "180px",
                        readonly: true
                    }
                },
                {
                    type: "checkbox",
                    name: "inArchive",
                    caption: "В архиве",
                    width: "180px",
                    padding: "0px",
                    input: {
                        width: "-webkit-fill-available",
                        readonly: true
                    }
                },
            ]
        },
        rowOptions: {
            alternationColor: "rgb(242, 242, 242)",
            rowSelectionColor: "rgb(207, 232, 252)"
        },
        behaviorOptions: {
            allowMultipleSelection: true,
            allowSelectAll: true,
            allowPaging: true,
            allowFiltering: true,
        },
    },
    mutations: {
        enableFiltering(state, allowFiltering) {
            state.behaviorOptions.allowFiltering = allowFiltering;
        },
        enableMultipleSelection(state, allowMultipleSelection) {
            state.behaviorOptions.allowMultipleSelection = allowMultipleSelection;
        },
        enableSelectAll(state, allowSelectAll) {
            state.behaviorOptions.allowSelectAll = allowSelectAll;
        },
        enablePaging(state, allowPaging) {
            state.behaviorOptions.allowPaging = allowPaging;
        }
    },
    getters: {
        getCommonTableOptions(state) {
            let commonTableOptions = [];
            Array.prototype.push.apply(commonTableOptions,
                [state.commonTableOptions.borders.top,
                state.commonTableOptions.borders.right,
                state.commonTableOptions.borders.bottom,
                state.commonTableOptions.borders.left,
                state.commonTableOptions.collapse]
            )
            return commonTableOptions;
        },
        getHeaderOptions(state) {
            let headerOptions = [];
            headerOptions.push(state.headerOptions);
            return headerOptions;
        },
        getHeaderCellsOptions(state) {
            let headerCellsOptions = [];
            headerCellsOptions.push(state.headerCellsOptions);
            return headerCellsOptions;
        },
        getFilterOptions(state) {
            let filterOptions = [];
            Array.prototype.push.apply(filterOptions,
                [state.filterOptions.borders.top,
                state.filterOptions.borders.bottom])
            return filterOptions;
        },
        getFilterCellsOptions(state) {
            let filterCellsOptions = [];
            filterCellsOptions.push(state.filterCellsOptions);
            return filterCellsOptions;
        },
        getnumberInputHorizontalAlign(state) {
            let numberInputHorizontalAlign = [];
            numberInputHorizontalAlign.push(state.columnOptions.numberInputHorizontalAlign);
            return numberInputHorizontalAlign;
        },
        getColumns(state) {
            return state.columnOptions.columns;
        },
        getColumnOptions(state) {
            return state.columnOptions;
        },
        getRowOptions(state) {
            return state.rowOptions;
        },
        getBehaviorOptions(state) {
            return state.behaviorOptions;
        },
        pagingColSpan(state) {
            let columnsCount = state.columnOptions.columns.length;
            return state.behaviorOptions.allowMultipleSelection ? columnsCount + 1 : columnsCount;
        }
    }
}