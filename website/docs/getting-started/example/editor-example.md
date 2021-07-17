---
nav:
  title: Docs
  order: -1
group:
  title: Example
title: Cell editing
order: 2
---

# Cell editing

<code src="../../../src/editor.tsx" title="Cell editing" desc="Provide a cell-editable table, Double click to edit" />

Need to create a component of `ComponentType<EditorProps>`, such as the following
 
```jsx | pure
const Input = ({ style, value: tempValue, onEditCompleted }: EditorProps) => {
    const [value, setValue] = useState(tempValue)
    return (
        <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            style={style}
            value={value as string}
            onBlur={() => {
                onEditCompleted(value)
            }}
            onChange={(e) => {
                const text = e.target.value
                setValue(text)
            }}
        />
    )
}
```

> `onEditCompleted` indicates when the editing is completed and switched to the normal display state

Then set the column attribute `editor`

```jsx | pure
const columns: Column<any>[] = [{
        name: 'id',
        title: 'id'
    },{
        name: 'userName',
        title: 'User Name',
        editor: Input,
    }, {
        name: 'address',
        title: 'Address',
        editor: Input,
    }, {
        name: 'email',
        title: 'E-Mail',
        editor: Input,
    }, {
        name: 'mobilePhone',
        title: 'Mobile Phone',
        editor: Input,
    }]
```

In this way, you can get the corresponding saved data in `onEditorChangeSave`
