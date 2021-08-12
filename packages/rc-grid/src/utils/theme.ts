
export interface Theme {
    'grid-border': string
    'grid-text-color': string
    'grid-row-background-color': string
    'grid-row-background-color-select': string
    'grid-row-background-color:hover': string
    'grid-row-cell-border-right': string
    'grid-row-cell-border-bottom': string
    'grid-row-cell-background-color-readonly': string
    'grid-row-cell-select': string
    'grid-header-cell-border-right': string
    'grid-header-cell-border-bottom': string
    'grid-header-cell-background-color': string
}

export const dark: Theme = {
    'grid-border': '1px solid hsl(0deg 0% 40%)',
    'grid-text-color': '#fff',
    'grid-row-background-color': '#000',
    'grid-row-background-color-select': 'hsl(0deg 0% 30%)',
    'grid-row-background-color:hover': 'hsl(0deg 0% 30%)',
    'grid-row-cell-border-right': '1px solid hsl(0deg 0% 40%)',
    'grid-row-cell-border-bottom': '1px solid hsl(0deg 0% 40%)',
    'grid-row-cell-background-color-readonly': 'hsl(0deg 0% 20%)',
    'grid-row-cell-select': 'inset 0 0 0 1px #66afe9',
    'grid-header-cell-border-right': '1px solid hsl(0deg 0% 40%)',
    'grid-header-cell-border-bottom': '1px solid hsl(0deg 0% 40%)',
    'grid-header-cell-background-color': 'hsl(0deg 0% 15%)'
}