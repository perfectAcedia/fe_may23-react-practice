import React, { Fragment, useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryByID(product.categoryId),
  user: getOwnerByID(getCategoryByID(product.categoryId).ownerId),
}));

function getCategoryByID(categoryID) {
  return categoriesFromServer.find(category => category.id === categoryID)
    || null;
}

function getOwnerByID(ownerId) {
  return usersFromServer.find(owner => owner.id === ownerId)
    || null;
}

function getFilteredByOwner(owner, query) {
  let filteredProduct = products.filter(product => product.user.name === owner);

  if (owner === 'All') {
    filteredProduct = [...products];
  }

  if (query) {
    const correctQuery = query.trim().toLowerCase();

    return (
      filteredProduct.filter(product => product.name
        .toLowerCase().includes(correctQuery))
    );
  }

  return filteredProduct;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');
  const visibleProducts = getFilteredByOwner(selectedUser, query);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser('All')}
                className={classNames(null, {
                  'is-active': selectedUser === 'All',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => selectedUser !== user.name
                    && setSelectedUser(user.name)}
                  className={classNames(null, {
                    'is-active': selectedUser === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  value={query}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query
                    && (
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    )
                  }
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUser('All');
                  setQuery('');
                }
                }
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            && (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}

          {visibleProducts.length !== 0
            && (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >

                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(visibleProduct => (
                    <Fragment key={visibleProduct.id}>
                      <tr data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {visibleProduct.id}
                        </td>

                        <td
                          data-cy="ProductName"
                        >
                          {visibleProduct.name}
                        </td>
                        <td data-cy="ProductCategory">
                          {`${visibleProduct.category.icon} - ${visibleProduct.category.title}`}
                        </td>

                        <td
                          className={
                            classNames('has-text-link', {
                              'has-text-danger':
                                visibleProduct.user.sex === 'f',
                            })}
                          data-cy="ProductUser"
                        >
                          {visibleProduct.user.name}
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
