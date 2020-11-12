from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(BaseModel):
    firebase_uid = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.firebase_uid}'


class Board(BaseModel):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='boards'
    )

    def __str__(self):
        return f'{self.title}'


class CardList(BaseModel):
    title = models.CharField(max_length=100)
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name='card_lists'
    )

    def __str__(self):
        return f'{self.title}'


class Card(BaseModel):
    title = models.CharField(max_length=100)
    description = models.TextField()
    position = models.IntegerField()
    card_list = models.ForeignKey(
        CardList, on_delete=models.CASCADE, related_name='cards'
    )

    def __str__(self):
        return f'{self.title}'
