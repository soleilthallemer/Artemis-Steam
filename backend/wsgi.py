from app import create_app

app = create_app()

if __name__ == "__main__":  # ✅ Correct condition
    app.run(debug=True)  # ✅ Enable debugging
