import uuid
import pytest
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND = "http://localhost:5173"
API = "http://localhost:5000/api/auth"


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,900")
    d = webdriver.Chrome(options=options)
    yield d
    d.quit()


@pytest.fixture
def user():
    """Creates a fresh user through the API, so the browser test can log in."""
    tag = uuid.uuid4().hex[:8]
    u = {
        "username": f"ui_{tag}",
        "email": f"ui_{tag}@example.com",
        "password": "Test@123",
    }
    requests.post(f"{API}/register", json=u)
    return u


def fill_and_submit(driver, email, password):
    driver.get(f"{FRONTEND}/login")
    wait = WebDriverWait(driver, 15)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()


def test_login_page_loads(driver):
    driver.get(f"{FRONTEND}/login")
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    )
    assert driver.find_element(By.CSS_SELECTOR, "input[type='password']").is_displayed()


def test_login_success_opens_dashboard(driver, user):
    fill_and_submit(driver, user["email"], user["password"])
    WebDriverWait(driver, 20).until(EC.url_contains("dashboard"))
    assert "dashboard" in driver.current_url


def test_login_wrong_password_shows_error(driver, user):
    fill_and_submit(driver, user["email"], "WrongPass@1")
    error = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Invalid email or password')]")
        )
    )
    assert error.is_displayed()
    assert "dashboard" not in driver.current_url


def test_demo_button_opens_dashboard(driver):
    driver.get(f"{FRONTEND}/login")
    btn = WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Try Demo')]"))
    )
    btn.click()
    WebDriverWait(driver, 15).until(EC.url_contains("dashboard"))
    assert "dashboard" in driver.current_url