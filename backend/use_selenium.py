from cryptography.fernet import Fernet
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
import time
f = open("pw_key.key", "r")
key = f.read()
fernet = Fernet(key)

options = webdriver.ChromeOptions()
options.add_argument('-headless')
driverPath='.\chromedriver.exe'


def login(browser):
    login_url = "https://ccweb.ncnu.edu.tw/SLLL/login.asp"
    browser.get(login_url)
    browser.find_element_by_id("username").send_keys(user_name)
    #browser.find_element_by_id("password").send_keys(fernet.decrypt(user_pw).decode())
    browser.find_element_by_id("password").send_keys(user_pw)
    browser.find_element_by_id("btnsubmit").click()

def reserve_activity(event_id):
    browser = webdriver.Chrome(executable_path=driverPath, options=options)
    enroll_url = "https://ccweb.ncnu.edu.tw/SLLL/z7DDA4E0A5831540Dadd.asp?showmaster=z958B653E5831540D4E4B6D3B52D5660E7D30&fk_RowID=" + event_id
    
    login(browser)
    time.sleep(2)
    browser.get(enroll_url)
    browser.find_element_by_id("btnAction").click()
    if not browser.find_elements_by_class_name("alert-success"):
        success = False 
    else:
        success = True
    browser.close()
    return success

def cancel_activity(event_id):
    browser = webdriver.Chrome(executable_path=driverPath, options=options)
    cancel_url = "https://ccweb.ncnu.edu.tw/SLLL/z7DDA4E0A5831540Dlist.asp?showmaster=z958B653E5831540D4E4B6D3B52D5660E7D30&fk_RowID=" + event_id

    login(browser)
    browser.get(cancel_url)
    try:
        browser.get(browser.find_element_by_class_name("ewDelete").get_attribute("href"))
        time.sleep(2)
        browser.find_element_by_id("btnAction").click()
        time.sleep(2)
        success = True
    except:
        success = False

    browser.close()
    return success

def encrypt_pw(pw):
    return fernet.encrypt(pw.encode())
