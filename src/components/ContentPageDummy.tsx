import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiEdit, FiRefreshCcw } from 'react-icons/fi';
import { VscNewFile, VscSearch } from 'react-icons/vsc';
import { IoMdClose } from 'react-icons/io';
import {Modal} from './Modal';

export default function ContentPageDummy() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  return (
    <div style={{ padding: '20px', marginBottom: '20px' }}>
      <div className='d-flex justify-content-between'>
        <div>
          <span
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='New'
          >
            <VscNewFile size={24} onClick={() => setIsOpen(true)} />
          </span>
          <span
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Edit'
          >
            <FiEdit size={24} />
          </span>
          <span
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Refresh'
          >
            <FiRefreshCcw size={24} />
          </span>
        </div>
        <div>
          <VscSearch size={24} style={{ marginRight: '10px' }} />
          <input
            className='input-field'
            placeholder='enter keyword'
            type='search'
          />
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>First</th>
              <th scope='col'>Last</th>
              <th scope='col'>Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope='row'>2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope='row'>3</th>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
