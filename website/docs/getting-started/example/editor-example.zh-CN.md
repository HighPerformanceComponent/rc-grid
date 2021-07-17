---
nav:
  title: Docs
  order: -1
group:
  title: 例子
title: 可编辑表格
order: 2
---

# 简单的表格

<code src="../../../src/editor.tsx" title="单元格编辑" desc="这是一个简单的自定义单元格编辑的表格, 双击可进行表格编辑" />


需要创建一个 `ComponentType<EditorProps>` 的组件, 例如一下
 
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

> `onEditCompleted` 表示在何时进行完成编辑，并且切换到正常显示的状态


然后在设置 列的属性 `editor`

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

这样就可以在 `onEditorChangeSave` 中获取对应保存的数据
