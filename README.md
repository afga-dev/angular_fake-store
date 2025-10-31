<h3 align="center">🛒 FAKE STORE</h3>
<p align="center">
  A Single Page Application (SPA) built with Angular that fully simulates the client-side experience of an e-commerce platform — complete with dynamic cart management and on-demand PDF invoice generation.
</p>

<p align="center">
<a href="#technology-stack"><strong>Technology Stack</strong></a> &nbsp;&bull;&nbsp;
<a href="#key-features"><strong>Key Features</strong></a> &nbsp;&bull;&nbsp;
<a href="#api-and-data-architecture"><strong>API and Data Architecture</strong></a> &nbsp;&bull;&nbsp;
<a href="#live-demo"><strong>Live Demo</strong></a> &nbsp;&bull;&nbsp;
<a href="#deployment"><strong>Deployment</strong></a> &nbsp;&bull;&nbsp;
<a href="#license"><strong>License</strong></a>
</p>

## Technology Stack

This application was developed using a modern, containerized front-end stack centered around Angular for robust architecture and Docker for reliable environment management.

- **Front-End Framework:** Angular (TypeScript)
- **Styling and UI:** Bootstrap and custom styling
- **Data Persistence:** `localStorage` and `sessionStorage`
- **Containerization:** Docker
- **Deployment:** Netlify

## Key Features

- **E-commerce Simulation:** A fully functional, client-side simulation of an online store that fetches dynamic product data from an external API.
- **Dynamic Shopping Cart:** Drawer-style cart for a seamless UX — supports quick add/remove actions and quantity updates.
- **Simulated Authentication:** Mock login system using `localStorage` for user session handling.
- **Global Search:** A persistent search bar that filters and redirects users to relevant products instantly.
- **On-Demand PDF Invoice Generation:** Generates a professional, itemized invoice upon checkout.
- **Client-Side Persistence:** Uses browser storage APIs to preserve cart and session data across reloads.
- **Responsive UI:** A fully responsive layout optimized for desktop, tablet, and mobile devices.

## API and Data Architecture

This application integrates with the public <a href="https://fakestoreapi.com/">Fake Store API</a> for product and user data, while using client-side persistence for all transactions.

### Data Source

- **Base URL:** `https://fakestoreapi.com`
- **Endpoints:**
  - `POST /auth/login` – Authentication
  - `GET /products` – Product data
  - `GET /users/{id}` – User data

### Client-Side Persistence Model

Although the <a href="https://fakestoreapi.com/">Fake Store API</a> supports `POST`, `PUT`, and `DELETE` requests, it doesn't persist changes server-side. To provide a realistic simulation:

- `localStorage`: Persists active cart contents and mock user profiles between sessions.
- `sessionStorage`: Temporarily stores order details post-checkout for invoice generation (data persists until the tab is closed).

## Live Demo

Check out the live deployed application <a href="https://afga-fake-store.netlify.app/">here</a>.

> **Note:** For demo purposes, use `johnd` / `m38rmF$` to sign in.

## Deployment

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/angular_fake-store.git
```

2. Navigate into the project folder:

```bash
cd angular-fake-store
```

3. Build the Docker image:

```bash
docker build -t angular-fake-store .
```

4. Run the container:

```bash
docker run -d -p 8080:80 angular-fake-store
```

> The application will be available at `http://localhost:8080/`. Make sure Docker is installed and running on your system.

## License

This project is licensed under the MIT License. See the <a href="https://github.com/afga-dev/angular_fake-store/blob/master/LICENSE">LICENSE</a> file for details.
