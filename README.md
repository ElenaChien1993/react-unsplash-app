[Udemy - Modern React with Redux](https://www.udemy.com/course/react-redux/learn/lecture/12531252#overview)

- 本章節重點：User Events / Fetch Data / Show list of records

# 03 - unsplash app

- V1 根據 search bar 的 input 關鍵字顯示相對應圖片，一整排直排列
- V2 把圖片排列調整成一頁式整齊排列

## 執行步驟

1. 先區分好主要的 component：最上層的 App 和 SearchBar / PictureList
2. SearchBar 用 semantic ui 做一些簡單的 styling，再用 `onchange` 串 event ，並確保這是個 **Controlled Component**

    ```jsx
    class SearchBar extends React.Component {
      state = { value: '' };

      onInputChange(e) {
        this.setState({ value: e.target.value });
      }
      
      render() {
        return (
          <div className="ui segment">
            <form className="ui form">
              <div className="field">
                <label>Image Search</label>
                <input 
                  type="search" 
                  placeholder="type to search"
                  value={ this.state.value } 
                  onchange={ this.onInputChange } 
                />
              </div>
            </form>
          </div>
        )
      }
    }
    ```

    💡如果想強制使用者輸入大寫💡

    因為 input element 的 value 這個 property 的值，同時就是畫面上輸入框內顯示的文字
    所以只要操作 value state 這個相對應的值即可

    ```jsx
    class SearchBar extends React.Component {
      state = { value: '' };

      onInputChange = (e) => {
        this.setState({ value: e.target.value.toUpperCase() });
      }
      
      render() {
        return (
          <div className="ui segment">
            <form className="ui form">
              <div className="field">
                <label>Image Search</label>
                <input 
                  type="search" 
                  placeholder="type to search"
                  value={ this.state.value } 
                  onchange={ this.onInputChange } 
                />
              </div>
            </form>
          </div>
        )
      }
    }
    ```

3. 按 Enter 鍵送出表單功能串接

    HTML 的 form 元素有 default 設定：按 Enter 鍵會自動 submit 並且 refresh 頁面

    所以要先把 default 設定取消掉，不想要他自動 refresh 頁面

    ```jsx
    onSubmitChang = (e) => {
      e.preventDefault();
    }

    <form onSubmit={ this.onSubmitChange } className="ui form">
    	....
    </form>
    ```

4. 將 SearchBar 的 input value 傳給父層（為了讓父層告知 Image 要出現哪些照片）

    把「input 值改變的話，同步更新父層 App state 的值」這個 fn 當成 props value 傳給 SearchBar，放在 onSubmit 的 fn 中，並把 form value 做為參數傳進 callback fn，
    只要子層 SearchBar 的 `onSubmit` 被觸發，就讀取這個 props value，等於 callback 父層的那個 fn

    💡 在 class component 中，要讀取 props 的值，要用 `this.props.xxx`

    ```jsx
    // 這是父層 App component

    class App extends React.Component {
      state = { searchField: '' };

      onSearchSubmit = value => {
        this.setState({ searchField: value });
      }

      render() {
        return (
          <div className="ui container" style={{ marginTop: '10px' }}>
            <SearchBar searchSubmit={ this.onSearchSubmit } />
          </div>
        )
      }
    }
    ```

    ```jsx
    // 這是子層 SearchBar component

    class SearchBar extends React.Component {
      state = { value: '' };

      onFormSubmit = e => {
        e.preventDefault();
        this.props.searchSubmit(this.state.value);
      }

      onInputChange = e => {
        this.setState({ value: e.target.value });
      }
      
      render() {
        return (
          <div className="ui segment">
            <form onSubmit={ this.onFormSubmit } className="ui form">
              <div className="field">
                <label>Image Search</label>
                <input 
                  type="search" 
                  placeholder="type to search"
                  value={ this.state.value } 
                  onchange={ this.onInputChange } 
                />
              </div>
            </form>
          </div>
        )
      }
    }
    ```

5. 向 Unsplash 發送 API request 

    老師介紹兩種方式，一種是之前已學過的 fetch function，但老師比較建議另一個 axios

    axios 是第三方 package，要用 npm 安裝的

    [fetch ＆ axios in React](https://medium.com/coding-hot-pot/fetch-axios-in-react-6edb19eb7e87)

    對於有大量 HTTP 請求，需要良好的錯誤處理或 HTTP 攔截的應用，
    Axios 是一個更好的解決方案。
    在小型專案的情況下，只需要幾個簡單的 API 呼叫，Fetch 也是一個不錯的解決方案。

    用 async await 搭配 axios 來發送 HTTP request：

    ```jsx
    onSearchSubmit = async (value) => {
      const respond = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: value },
        headers: { Authorization: 'Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70' }
      });
    }
    ```

6. 將得到的 response 放入 App 的自訂 state 當中來做使用

    我們需要的資料是存取在 get 之後得到的 respond 裡面的 `data.results`

    先嘗試在頁面上顯示撈取到的 image 的張數：
    ⚠️ 記得要將 fn 改成 arrow fn，`this.setState` 的 this 才是指向 App component 本身 ⚠️

    ```jsx
    class App extends React.Component {
      state = { images: [] };

      onSearchSubmit = async (value) => {
        const respond = await axios.get('https://api.unsplash.com/search/photos', {
          params: { query: value },
          headers: { Authorization: 'Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70' }
        });

        this.setState({ images: respond.data.results });
      }

      render() {
        return (
          <div className="ui container" style={{ marginTop: '10px' }}>
            <SearchBar searchSubmit={ this.onSearchSubmit } />
            found {this.state.images.length} images
          </div>
        )
      }
    }
    ```

7. 把 API request 的 code 獨立出來另外在 api 資料夾中新增一個 component

    改用 `axios.create()` 直接建立一個通用的 instance，好處有：

    1. 統一套用 Config
    2. 統一管理 API，日後修改容易（分開檔案、Import ）
    3. 減少 URL 冗長更易讀（ baseURL 運用）

    ```jsx
    // api 資料夾中的 unsplash.js
    export default axios.create({
      baseUrl: 'https://api.unsplash.com',
      headers: {
        Authorization: 'Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70'
      }
    });

    // App conponent
    onSearchSubmit = async (value) => {
      const respond = await unsplash.get('/search/photos', {
        params: { query: value },
      });

      this.setState({ images: respond.data.results });
    }
    ```

8. 把 display image 的功能再做成一個 component ImageList

    將 API request 收到的 images response 更新父層 App 的 images state
    再當成 props 傳給 ImageList

    ```jsx
    // App component
    class App extends React.Component {
      state = { images: [] };

      onSearchSubmit = async (value) => {
        const respond = await unsplash.get('/search/photos', {
          params: { query: value },
        });

        this.setState({ images: respond.data.results });
      }

      render() {
        return (
          <div className="ui container" style={{ marginTop: '10px' }}>
            <SearchBar searchSubmit={ this.onSearchSubmit } />
            <ImageList images={ this.state.images }/>
          </div>
        )
      }
    }
    ```

    ```jsx
    // ImageList Component
    const ImageList = props => {
      const images = props.images.map(image => {
        return <img src={ image.urls.regular } alt={ image.alt_description }/>
      })

      return (
        <div>{ images }</div>
      )
    };
    ```

9. 會發現 console 出現 warning，說我們的 list 沒有設定 key props

    那為什麼會建議要給 list items 一個 key props 呢？
    >> 因為這會讓 react 在 re-render 的時候，更精準的比較前後差異（什麼被更新）

    通常會把 list items 的 id 當成 key props，因為 id 都是不一樣，不會重複的

    ```jsx
    const ImageList = props => {
      const images = props.images.map(({ id, urls, alt_description }) => {
        return <img key={ id } src={ urls.regular } alt={ alt_description }/>
      })

      return (
        <div>{ images }</div>
      )
    };
    ```

10. 接下來進入 V2 部分：調整圖片排列更美觀

    先用 css 採用 grid 來排列圖片，把直欄排列設定完

    ```css
    .image-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      grid-gap: 10px;
    }

    .image-list img {
      width: 250px;
    }
    ```

    會希望橫的 row 可以根據每張圖片的寬來判斷，該圖片要佔幾 row
    （先用 `grid-auto-rows: xxxpx` 再用 `grid-row-end: span 數字`）

    這時就需要用另一個 component 來一次 render 一張圖片，
    目的是為了在該 component 裡面用 js 程式碼去個別判斷，依據圖片的高來設定 row 要佔幾行

    把 ImageCard 包在 ImageList 裏面：

    ```jsx
    // ImageList component
    const ImageList = props => {
      const images = props.images.map(image => {
        return <ImageCard key={ image.id } image={ image } />
      })

      return (
        <div className="image-list" >{ images }</div>
      )
    };
    ```

    ```jsx
    // ImageCard component
    class ImageCard extends React.Component {
      render() {
        const { alt_description, urls } = this.props.image;

        return (
          <div>
            <img 
              alt={ alt_description} 
              src={ urls.regular }
            />
          </div>
        )
      }
    }
    ```

11. 要如何讓每張圖片依據他的高來調整自己的 css grid row 佔比呢？

    詳細步驟如下：

    1. 讓 ImageCard render 每張圖片（詳見上面步驟 10 ）
    2. 跟 DOM 溝通，拿到圖片尺寸的高

        這邊使用 React 系統中的 Refs 來取得 DOM 資料（詳見下面的學習重點 4 ）

        ```jsx
        class ImageCard extends React.Component {
          constructor(props) {
            super(props);

            this.imageRef = React.createRef();
          }

          componentDidMount() {
            this.imageRef.current.addEventListener('load', this.setSpans);
          }

          setSpans = () => {
            console.log(this.imageRef.current.clientHeight);
          }

          render() {
            const { alt_description, urls } = this.props.image;

            return (
              <div>
                <img 
                  ref={ this.imageRef }
                  alt={ alt_description} 
                  src={ urls.regular }
                />
              </div>
            )
          }
        }
        ```

    3. 用 state 來記錄根據每張圖片的高，有不同的佔比，促使 component re-render

        ```jsx
        constructor(props) {
          super(props);

          this.state = { spans: 0 };

          this.imageRef = React.createRef();
        }

        componentDidMount() {
          this.imageRef.current.addEventListener('load', this.setSpans);
        }

        setSpans = () => {
          const height = this.imageRef.current.clientHeight;

          const spans = Math.ceil(height / 10);

          this.setState({ spans: spans });
        }
        ```

    4. 在每次的 re-render 中，assign `grid-row-end` 這個 css 樣式，
    確保每張圖片都有根據自己的高，而有相對應的佔比

        直接使用 html in-line style 方式

        ```jsx
        render() {
          const { alt_description, urls } = this.props.image;

          return (
            <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
              <img 
                ref={ this.imageRef }
                alt={ alt_description} 
                src={ urls.regular }
              />
            </div>
          )
        }
        ```

## 學習重點

### 1. 遇到表單 element 盡量使用 Controlled Component

什麼是 Controlled Component？跟 Uncontrolled 又有什麼差別？  

[表單 - React](https://zh-hant.reactjs.org/docs/forms.html)
