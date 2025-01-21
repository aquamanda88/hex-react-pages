import {
  Button,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Header } from '../components';

export default function Home() {
  return (
    <>
      <Header title='Components' />
      <div className='container'>
        <div className='d-flex align-items-start'>
          <div
            className='nav flex-column nav-pills me-3'
            id='v-pills-tab'
            role='tablist'
            aria-orientation='vertical'
          >
            <button
              className='nav-link active'
              id='v-pills-button-tab'
              data-bs-toggle='pill'
              data-bs-target='#v-pills-button'
              type='button'
              role='tab'
              aria-controls='v-pills-button'
              aria-selected='true'
            >
              Button
            </button>
            <button
              className='nav-link'
              id='v-pills-input-tab'
              data-bs-toggle='pill'
              data-bs-target='#v-pills-input'
              type='button'
              role='tab'
              aria-controls='v-pills-input'
              aria-selected='false'
            >
              Input
            </button>
          </div>
          <div className='tab-content m-auto' id='v-pills-tabContent'>
            <div
              className='tab-pane fade show active'
              id='v-pills-button'
              role='tabpanel'
              aria-labelledby='v-pills-button-tab'
              tabIndex={0}
            >
              <h2>Contained</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Primary</th>
                    <th scope='col'>Secondary</th>
                    <th scope='col'>Danger</th>
                    <th scope='col'>Disabled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <Button className='btn btn-primary' variant='contained'>
                        測試文字
                      </Button>
                    </td>
                    <td>
                      <Button className='btn btn-secondary' variant='contained'>
                        測試文字
                      </Button>
                    </td>

                    <td>
                      <Button className='btn btn-danger' variant='contained'>
                        測試文字
                      </Button>
                    </td>
                    <td>
                      <Button className='btn' variant='contained' disabled>
                        測試文字
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Icon + Normal</td>
                    <td>
                      <Button className='btn btn-primary' variant='contained'>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                    <td>
                      <Button className='btn btn-secondary' variant='contained'>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                    <td>
                      <Button className='btn btn-danger' variant='contained'>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                    <td>
                      <Button className='btn' variant='contained' disabled>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2>Outlined</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Primary</th>
                    <th scope='col'>Secondary</th>
                    <th scope='col'>Disabled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <Button className='btn btn-primary' variant='outlined'>
                        測試文字
                      </Button>
                    </td>
                    <td>-</td>
                    <td>
                      <Button className='btn' variant='outlined' disabled>
                        測試文字
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Icon + Normal</td>
                    <td>
                      <Button className='btn btn-primary' variant='outlined'>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                    <td>-</td>
                    <td>
                      <Button className='btn' variant='outlined' disabled>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2>Text</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Primary</th>
                    <th scope='col'>Secondary</th>
                    <th scope='col'>Disabled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <Button className='btn btn-primary'>測試文字</Button>
                    </td>
                    <td>
                      <Button className='btn btn-secondary'>測試文字</Button>
                    </td>
                    <td>
                      <Button className='btn btn-danger'>測試文字</Button>
                    </td>
                    <td>
                      <Button className='btn' disabled>
                        測試文字
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Icon + Normal</td>
                    <td>
                      <Button className='btn btn-primary'>
                        <AddIcon />
                        <p className='btn-icon'>測試文字</p>
                      </Button>
                    </td>
                    <td>
                      <Button className='btn btn-secondary'>
                        <p className='btn-icon'>測試文字</p>
                        <KeyboardArrowRightIcon />
                      </Button>
                    </td>
                    <td>
                      <Button className='btn' disabled>
                        <KeyboardArrowLeftIcon />
                        <p className='btn-icon'>測試文字</p>
                        <KeyboardArrowRightIcon />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2>Icon</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Primary</th>
                    <th scope='col'>Secondary</th>
                    <th scope='col'>Disabled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </td>
                    <td>-</td>
                    <td>
                      <IconButton disabled>
                        <AddIcon />
                      </IconButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Small</td>
                    <td>
                      <IconButton size='small'>
                        <AddIcon />
                      </IconButton>
                    </td>
                    <td>-</td>
                    <td>
                      <IconButton size='small' disabled>
                        <AddIcon />
                      </IconButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Large</td>
                    <td>
                      <IconButton size='large'>
                        <AddIcon />
                      </IconButton>
                    </td>
                    <td>-</td>
                    <td>
                      <IconButton size='large' disabled>
                        <AddIcon />
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className='tab-pane fade'
              id='v-pills-input'
              role='tabpanel'
              aria-labelledby='v-pills-input-tab'
            >
              <h2>Text</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Outlined</th>
                    <th scope='col'>Filled</th>
                    <th scope='col'>Standard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <TextField
                        variant='outlined'
                        id='outlined-text'
                        name='outlined-text'
                        label='測試文字'
                      />
                    </td>
                    <td>
                      <TextField
                        variant='filled'
                        id='filled-text'
                        name='filled-text'
                        label='測試文字'
                      />
                    </td>
                    <td>
                      <TextField
                        variant='standard'
                        id='standard-text'
                        name='standard-text'
                        label='測試文字'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Disabled</td>
                    <td>
                      <TextField
                        variant='outlined'
                        id='outlined-text'
                        name='outlined-text'
                        label='測試文字'
                        disabled
                      />
                    </td>
                    <td>
                      <TextField
                        variant='filled'
                        id='filled-text'
                        name='filled-text'
                        label='測試文字'
                        disabled
                      />
                    </td>
                    <td>
                      <TextField
                        variant='standard'
                        id='standard-text'
                        name='standard-text'
                        label='測試文字'
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Error</td>
                    <td>
                      <TextField
                        variant='outlined'
                        id='outlined-text'
                        name='outlined-text'
                        label='測試文字'
                        error
                        helperText='Incorrect entry.'
                      />
                    </td>
                    <td>
                      <TextField
                        variant='filled'
                        id='filled-text'
                        name='filled-text'
                        label='測試文字'
                        error
                        helperText='Incorrect entry.'
                      />
                    </td>
                    <td>
                      <TextField
                        variant='standard'
                        id='standard-text'
                        name='standard-text'
                        label='測試文字'
                        error
                        helperText='Incorrect entry.'
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2>Suffix</h2>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Outlined</th>
                    <th scope='col'>Filled</th>
                    <th scope='col'>Standard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Normal</td>
                    <td>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='filled'>
                        <FilledInput
                          id='filled-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='standard'>
                        <Input
                          id='standard-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>HelperText</td>
                    <td>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                        <FormHelperText id='outlined-weight-helper-text'>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='filled'>
                        <FilledInput
                          id='filled-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                        <FormHelperText id='filled-weight-helper-text'>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='standard'>
                        <Input
                          id='standard-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                        />
                        <FormHelperText id='standard-weight-helper-text'>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>Disabled</td>
                    <td>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          disabled
                        />
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='filled'>
                        <FilledInput
                          id='filled-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          disabled
                        />
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='standard'>
                        <Input
                          id='standard-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          disabled
                        />
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>Error</td>
                    <td>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          error
                        />
                        <FormHelperText id='outlined-weight-helper-text' error>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='filled'>
                        <FilledInput
                          id='filled-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          error
                        />
                        <FormHelperText id='filled-weight-helper-text'>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                    <td>
                      <FormControl variant='standard'>
                        <Input
                          id='standard-adornment-weight'
                          endAdornment={
                            <InputAdornment position='end'>kg</InputAdornment>
                          }
                          error
                        />
                        <FormHelperText id='standard-weight-helper-text'>
                          Weight
                        </FormHelperText>
                      </FormControl>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
