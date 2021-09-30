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

在 HTML 中，表單的 element 像是 input、textarea 和 select 通常會維持它們自身的 state，並根據使用者的輸入來更新 state。

在 React 中，可變的 state 通常是被維持在 component 中的 state property，並只能以 `setState()` 來更新，
所以如果有將使用者的輸入跟 component 的 state 結合，React component 同時有掌握到後續使用者的輸入對表單帶來的改變，就被稱為「controlled component」。

❓ 要怎麼變成 Controlled Component？

設定一個 value state 給 component，並用一個 fn 監聽 `onchange`，
讓每一次輸入都用 `setState()` 更新那個 value state，然後把 state 的值指定給這個 element 的 value props

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

雖然這樣會多寫 code，但重點是希望把 data 或 info 存在 react component 中，
而不是存在 HTML DOM 中！

### 2. axios 發送 HTTP request

[React系列十三 - axios庫的使用_coderwhy - MdEditor](https://www.gushiciku.cn/pl/pZwZ/zh-tw)

axios 有多種請求方式，現在先以此次有遇到的為主來筆記

1. `axios(config 物件)`

    ```jsx
    axios({
    	method: "get",
      url: "https:httpbin.org/get",
      params: {
    		name: "coderwhy",
        age: 18
      }
      })
    	.then(res => { console.log("請求結果:", res); })
    	.catch(err => { console.log("錯誤資訊:", err); });
    ```

2. 直接指定 `axios.get(url , config 物件)`

    這邊一樣先介紹這次有使用到的 config 物件屬性：

    - params：是指加在 url 後面的參數
    - headers：要傳送的自定義 headers？不太懂，
    但像是 Unsplash 的個人 API key 可以放在這邊，就不用在 url 後面加參數

    ```jsx
    onSearchSubmit = value => {
      axios.get('https://api.unsplash.com/search/photos', {
        params: { query: value },
        headers: { Authorization: 'Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70' }
      });
    }
    ```

3. 改用 `axios.create()` 直接建立一個通用的 instance，好處有：
    1. 統一套用 Config
    2. 統一管理 API，日後修改容易（分開檔案、Import ）
    3. 減少 URL 冗長更易讀（ baseURL 運用）

### 3. CSS grid 複習

[https://www.notion.so/0617-Udemy-CSS-741e8dddeffb41948646cc5faa49c533#247cf0cd02864c59ba89eb4fa92f0b8e](https://www.notion.so/0617-Udemy-CSS-741e8dddeffb41948646cc5faa49c533)

RWD 排版組合技：repeat() & auto-fill/fit & minmax()

```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* 當畫面最小抵達 200px 的時候，就都使用 1fr 呈現 */
```

### 4. React Refs

[Refs 和 DOM - React](https://zh-hant.reactjs.org/docs/refs-and-the-dom.html)

- Give access to a single DOM element
- Create refs in the constructor, assign them to instance variables, then pass to a particular JSX element as props

什麼時候該使用 Ref？

有幾種適合使用 ref 的情況：

- 管理 focus、選擇文字、或影音播放
- 觸發即時的動畫
- 與第三方 DOM 函式庫整合

建立 Ref

Ref 是藉由使用 `React.createRef()` 所產生的

Ref 常常會在一個 component 被建立出來的時候，被賦值在某個 instance 屬性，
這樣一來他們就可以在整個 component 裡面被參考

```jsx
constructor(props) {
  super(props);

  this.imageRef = React.createRef();
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
```

存取 Ref

當 ref 在 `render` 裡被傳到一個 element 的時候，
一個指向節點對 ref 的 `current` 參數的參考會變得可以取得。

Ref 的值會根據節點的類型而有所不同：

- 當在 HTML element 上使用 `ref` 參數時，使用 `React.createRef()` 建立 `ref` 會取得它底下的 DOM element 來做為它的 `current` 屬性
- 當在客製化的 class component 使用 `ref` 參數時，`ref` 取得被 mount 的 component 上的 instance 來當作他的 `current`
- **你不能在 function component 上使用 `ref`**，因為他們沒有 instance

React 會在 component mount 的時候將 DOM element 賦值到 `current` 屬性，
並在 unmount 時將它清空回 `null`。

ref 的更新發生在生命週期 `componentDidMount` 或 `componentDidUpdate` 之前。

```jsx
componentDidMount() {
  console.log(this.imageRef);
}
```

在 console 中會出現一個有 current 屬性的物件，value 是 img 這個 DOM 節點

要取得 img 的 height，很直接預想是如下：

```jsx
componentDidMount() {
  console.log(this.imageRef.current.clientHeight);
}
```

但結果會出現 0！為什麼呢？

先用以下程式碼測試結果

```jsx
componentDidMount() {
	console.log(this.imageRef);
  console.log(this.imageRef.current.clientHeight);
}
```

結果是明明在 console 展開 `this.imageRef` 裡面是可以找到 `clientHeight`，
但第二行程式碼在 console 中印出 0！

因為其實在我們 console log 的時候，圖片還沒被 load，
所以對瀏覽器來說我們執行 console log 的時候其實是沒有圖片的

為了修正這個錯誤，當然是要確定我們 load 完圖片再執行，
所以這邊用 evnet listener 監聽 load 事件，再指定一個 callback fn 給他，
記得用 arrow fn

```jsx
componentDidMount() {
  this.imageRef.current.addEventListener('load', this.setSpans);
}

setSpans = () => {
  console.log(this.imageRef.current.clientHeight);
}
```
