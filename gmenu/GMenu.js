import React from 'react';

import Group from './Group';
import Item from './Item';
import SubItem from './SubItem';

import './GMenu.less';

export {Group, Item, SubItem};
export default class GMenu extends React.Component {
    static Group = Group;
    static Item = Item;
    static SubItem = SubItem;

    constructor() {
        super();
        this.state = {
            isOpen: false,
            active: null,
            menuList: [],
            subMenuMap: {}
        }
    }

    componentWillMount() {
        this.state.active = this.props.default;
        this.handleItems(this.props.children);
    }

    renderMenus() {
        return <div className="g-menu-list-container">
            <ul className="g-menu-list">
                {this.state.menuList.map(menu =>
                    <li className={`g-menu-item ${this.state.active === menu.key ? 'active' : ''}`}
                        onClick={menu.onClick || (() => {
                        })}
                        key={menu.key} onMouseEnter={() => {
                        this.setState({active: menu.key})
                    }}>{menu.title}</li>
                )}
            </ul>
        </div>;
    }

    renderSubMenus() {
        const elements = [];
        for (let key in this.state.subMenuMap) {
            if (!this.state.subMenuMap.hasOwnProperty(key)) {
                continue;
            }

            const groups = this.state.subMenuMap[key];
            const width = !this.props.column || this.props.column === -1 ? (100 / groups.length) : (100 / this.props.column);

            elements.push(<div className="g-menu-sub-container" key={key}
                               style={{display: this.state.active === key ? 'block' : 'none'}}>
                {groups.map((group, index) =>
                    <ul className="g-menu-sub-group" key={index} style={{width: width + '%'}}>
                        {group.map((submenu, index) =>
                            <li className="g-menu-sub-item" key={index}>{submenu.children}</li>
                        )}
                    </ul>
                )}
            </div>)
        }
        return elements;
    }

    render() {
        return (
            <div className="g-menu">
                <a className={`g-menu-btn ${this.state.isOpen ? 'active' : ''}`} href="javascript:void 0;"
                   onClick={() => {
                       this.setState({isOpen: !this.state.isOpen})
                   }}>
                    {this.props.btnName}
                    <span
                        className="ant-select-arrow" unselectable="unselectable"
                        style={{userSelect: 'none'}}><b />
                    </span>
                </a>
                <div className="g-menu-bg"
                     style={{display: this.state.isOpen ? 'block' : 'none'}}
                     onClick={() => {
                         this.setState({isOpen: !this.state.isOpen})
                     }}/>
                <div className="g-menu-container" style={{display: this.state.isOpen ? 'block' : 'none'}}>
                    {this.renderMenus()}
                    {this.renderSubMenus()}
                </div>
            </div>
        );
    }

    handleItems(children) {
        children = this.transformToArray(children);
        children.forEach(child => {
            switch (child.type.name) {
                case Item.name:
                    this.state.menuList.push({
                        key: child.key,
                        title: child.props.title,
                        desc: child.props.desc,
                        onClick: child.props.onClick
                    });
                    if (child.props.children) {
                        this.handleGroups(child.key, child.props.children);
                    }
                    break;

                default:
                    return this.handleItems(child.props.children);
            }
        })
    }

    handleGroups(key, children) {
        if (!this.state.subMenuMap[key]) {
            this.state.subMenuMap[key] = []; //groups
        }
        const groups = this.state.subMenuMap[key];
        const group = [];

        children = this.transformToArray(children);
        children.forEach(child => {
            switch (child.type.name) {
                case Group.name:
                    groups.push(this.handleSubItems(key, child.props.children));
                    break;
                default:
                    const subItem = this.handleSubItem(key, child);
                    if (subItem) {
                        group.push(subItem);
                    }
            }
        });

        if (group.length > 0) {
            groups.push(group);
        }
    }

    handleSubItem(key, child) {
        let subItem;
        if (!child.type) {
            return null;
        }

        switch (child.type.name) {
            case SubItem.name:
                subItem = {
                    key: key,
                    children: child.props.children
                };
                break;
        }

        return subItem;
    }

    handleSubItems(key, children) {
        const group = [];
        children = this.transformToArray(children);
        children.forEach(child => {
            const subItem = this.handleSubItem(key, child);
            if (subItem) {
                group.push(subItem);
            }
        });

        return group;
    }

    transformToArray(children) {
        if (typeof children === 'object' && !children.forEach) {
            return [children];
        }

        return children;
    }
}