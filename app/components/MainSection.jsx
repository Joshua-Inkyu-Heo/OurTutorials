import React, { PropTypes } from 'react';
import CategoryItem from 'components/CategoryItem';
import classNames from 'classnames/bind';
import styles from 'css/components/main-section';

const cx = classNames.bind(styles);

const MainSection = ({onGetChildren, onGetLinks, onAdd, categories}) => {
  const categoryItems = categories.map((category, key) => {
    return (
      <CategoryItem index={key}
        id={category._id}
        key={key}
        name={category.name}
        onGetChildren={onGetChildren}
        onGetLinks={onGetLinks} />);
    });

  return (
    <div className={cx('main-section')}>
      <h3 className={cx('header')}>Choose A Category</h3>
      <ul className={cx('list')}>{categoryItems}</ul>
    </div>
  );
};

MainSection.propTypes = {
  // links: PropTypes.array.isRequired,
  // onIncrement: PropTypes.func.isRequired,
  // onDecrement: PropTypes.func.isRequired,
  // onDestroy: PropTypes.func.isRequired
  categories: PropTypes.array.isRequired,
  onGetChildren: PropTypes.func.isRequired,
  onGetLinks: PropTypes.func.isRequired,
  // onAdd: PropTypes.func.isRequired
};

export default MainSection;
